---
inject: true
to: src/tasks/tasks.module.ts
before: // insert new imports here
---
import { <%= Name %> } from './<%= type %>/<%= h.changeCase.camel(name) %>.task'