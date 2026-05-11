---
title: "Mi homelab desde cero"
description: "Cómo monté un homelab con Traefik, Dokploy, Home Assistant, Forgejo y servicios propios — todo con hardware reciclado y sin depender de ninguna nube de terceros."
publishDate: 2026-05-11
type: article
coverImage: "/assets/blog/homelab.png"
draft: false
---

No quería un rack lleno de LEDs ni montar Kubernetes en casa para mover cuatro contenedores. Solo quería dejar de depender de internet para cosas que pasan dentro de mi propia red.

Hace unos meses me cansé bastante de dos cosas: pagar servicios que realmente podía alojar yo, y depender de terceros para cosas tan básicas como desplegar una app o controlar luces de casa. Así acabé montando un homelab bastante sencillo sobre el papel, pero que poco a poco se ha convertido en la infraestructura que más uso en mi día a día.

No tiene nada especialmente espectacular: un portátil viejo con Arch Linux, una Raspberry Pi 4B+, una torre dedicada a IA local, y bastantes contenedores Docker. Pero funciona. Y sobre todo, funciona incluso cuando internet deja de hacerlo.

El proyecto sigue bastante en beta. Estoy probando stacks, quitando herramientas, rompiendo cosas y viendo qué merece la pena mantener de verdad. Por eso todavía no hay una capa seria de observabilidad, backups automatizados ni hardening fuerte. Prefiero estabilizar primero el sistema antes de dedicar semanas a blindar algo que igual dentro de un mes ya no existe.

## Hardware reciclado y Docker Compose

El portátil principal lleva prácticamente todo: Home Assistant, Forgejo, Dokploy, Traefik, Zigbee2MQTT, AdGuard Home, y el resto de servicios internos. La Raspberry Pi está dedicada solo a ADS-B para tracking de vuelos. Y la torre tiene un único trabajo: mover modelos locales sin pelearse por RAM con Home Assistant.

La red es una red doméstica normal a 1GbE. Nada enterprise. Tampoco quería eso.

Todo el stack corre con Docker Compose. Estuve valorando k3s y Kubernetes, pero sinceramente me parecía absurdo para ocho contenedores y hardware reciclado. Bastante mantenimiento tiene ya una casa como para encima convertirla en un clúster.

Compose aquí tiene mucho sentido: poco consumo, fácil de entender, fácil de levantar otra vez, y fácil de depurar cuando algo explota. Los compose y configuraciones viven en un monorepo dentro de Forgejo.

## Todo local por una razón

La idea principal desde el principio era que todo siguiera funcionando offline. No quería que las luces, sensores, automatizaciones, despliegues, o incluso parte de la IA dependieran de que una API externa estuviera viva.

Por eso prácticamente todo el stack funciona localmente: Home Assistant, Zigbee2MQTT, Matter, DNS interno, Forgejo, despliegues, y modelos locales vía Ollama.

Internet sigue siendo útil para muchas cosas. Sobre todo para programación seria con Claude Sonnet o Gemini cloud. Ahí todavía no hay color. Pero para automatización, tooling interno y mantenimiento básico, tenerlo local cambia bastante la experiencia.

También te obliga a entender mejor cómo funcionan realmente las piezas. Cuando montas DNS, reverse proxy, runners, redes Docker y automatización dentro de tu propia red, muchas abstracciones desaparecen rápido.

## DNS interno y Traefik

Para acceder a los servicios uso subdominios locales. La estructura es sencilla:

```
home.lab.local
git.lab.local
```

AdGuard Home hace de DNS interno y además bloquea bastante basura de publicidad y tracking en la red. La configuración es añadir en *Filters → DNS rewrites* una entrada por cada servicio, o un wildcard que lo cubra todo:

```
home.lab.local → 192.168.x.x
git.lab.local  → 192.168.x.x
*.lab.local    → 192.168.x.x
```

La gracia no es bloquear anuncios. La gracia es dejar de pensar en IPs y puertos para todo.

Traefik es el reverse proxy principal. Toda entrada HTTP pasa por ahí y se enruta según hostname usando labels Docker:

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.forgejo.rule=Host(`git.lab.local`)"
  - "traefik.http.routers.forgejo.entrypoints=web"
```

Y aquí tengo sentimientos encontrados. Por un lado funciona bien, encaja muy cómodo con Docker, y automatiza bastante. Por otro se vuelve complejo rápido, algunas decisiones del proyecto no me convencen demasiado, y seguramente termine cambiándolo más adelante. De hecho Traefik y AdGuard probablemente sean las piezas con más papeletas de desaparecer cuando estabilice el stack.

## Dokploy fue la sorpresa

Probé Coolify antes y acabé bastante cansado. Mucha capa, mucha interfaz y demasiada sensación de estar montando infraestructura para gestionar infraestructura.

Dokploy en cambio encajó bastante mejor con lo que necesitaba: despliegues rápidos, Git, variables, logs, y poco más. Lo tengo conectado con Forgejo mediante webhooks y cada push redepliega automáticamente las apps internas.

También es probablemente el servicio que más me sorprendió a nivel de consumo. Junto con Home Assistant es de lo que más RAM se bebe ahora mismo.

Actualmente gran parte del mantenimiento lo hago apoyándome en agentes locales. Para updates simples y mantenimiento básico funcionan bastante bien. En cuanto empiezas con networking raro, proxies o cosas más delicadas, ya toca revisar todo línea por línea igualmente.

## Home Assistant acabó siendo el centro de todo

Empecé montándolo "para probar cosas" y ahora mismo es probablemente el servicio más importante del homelab. Controla luces, sensores, presencia, puertas, automatizaciones, dispositivos Zigbee, y Matter sobre Thread.

La automatización más útil ni siquiera es complicada: que me avise cuando se abre una puerta. Parece una tontería hasta que te acostumbras a saber cuándo llega alguien, controlar mejor a las mascotas, o evitar el susto de escuchar ruido y no saber si ha entrado alguien o simplemente ha llegado la limpieza.

Y ahí es donde el homelab deja de ser un proyecto técnico y pasa a ser infraestructura cotidiana. Mi pareja usa automatizaciones de luces sin pensar siquiera que vienen de Home Assistant.

Para Zigbee uso un SONOFF Zigbee 3.0 USB Dongle Plus con Zigbee2MQTT. De momento Zigbee está funcionando muchísimo mejor de lo que esperaba.

Matter ya es otra historia. Matter sobre Thread todavía me está dando bastante guerra, especialmente el border router del Google Nest Hub. Probablemente ha sido una de las partes más pesadas de depurar hasta ahora.

## Forgejo, runners y pelearme con CI

Forgejo es donde vive prácticamente todo: repositorios, compose files, automatizaciones, configs, y despliegues. Lo elegí principalmente por filosofía y licencias frente a Gitea upstream.

El runner de Forgejo ha sido probablemente el servicio que más problemas me ha dado. Bastante más que Docker o incluso Traefik. Ahí sí acabé peleándome con permisos, redes y configuraciones bastante más tiempo del que esperaba.

Pero también es de esas cosas donde más aprendes porque cuando algo falla no tienes una plataforma cloud escondiendo lo que pasa debajo.

## IA local: útil, pero sin humo

La torre dedicada a IA tiene una RTX 4070 Ti de 16 GB, un i5 de 13ª generación, y 32 GB de RAM. Ahora mismo corro variantes optimizadas de Gemma 4 mediante Ollama, principalmente 26B y E4B.

De momento la uso para mantenimiento básico, despliegues, automatización, y tooling interno. Para programar de verdad sigo usando Claude Sonnet casi siempre. Ahí la diferencia todavía es bastante grande.

Aun así, tener modelos locales para tareas internas es comodísimo: no dependes de APIs, todo queda dentro de red local, y las respuestas son bastante rápidas para tareas pequeñas.

También es verdad que la inferencia local tiene límites muy claros: contexto, VRAM, velocidad, y calidad frente a cloud. No creo que sustituya servicios externos a corto plazo, pero sí creo que cada vez tiene más sentido para tooling personal y automatización.

## Lo que todavía está verde

Ahora mismo el homelab no está pensado como infraestructura crítica ni mucho menos. Si mañana muere el portátil principal, tengo un problema serio.

Todavía no hay backups sólidos, restores probados, observabilidad seria, segmentación de red, ni hardening fuerte. Y sinceramente prefiero admitirlo antes que fingir que esto es un mini datacenter enterprise.

La prioridad inicial era otra: encontrar herramientas que realmente quiera mantener, entender qué piezas merecen la pena, y construir algo cómodo para mi día a día. La parte seria de resiliencia y seguridad llegará cuando deje de cambiar el stack cada semana.

## Lo que más me ha gustado de todo esto

Montar el homelab no me ha hecho querer añadir más infraestructura. Más bien lo contrario. Me ha hecho cuestionarme cuánta necesito realmente.

También me ha reconciliado bastante con tocar hardware otra vez, entender mejor qué pasa debajo de las abstracciones cloud y dejar de asumir que todo necesita un SaaS detrás.

Muchas veces un portátil viejo, Docker Compose y algo de paciencia resuelven bastante más de lo que parece.
