---
inject: true
to: src/app.module.ts
before: // insert new imports here
---
<% single = h.changeCase.camel(h.inflection.singularize(name)) -%>
<% Single = h.changeCase.pascalCase(single) -%>
<% plural = h.changeCase.camel(h.inflection.pluralize(name)) -%>
<% Plural = h.changeCase.pascalCase(plural) -%>
import { <%= Plural %>Module } from 'src/<%=h.changeCase.paramCase(h.inflection.pluralize(name))%>/<%=h.changeCase.paramCase(h.inflection.pluralize(name))%>.module'