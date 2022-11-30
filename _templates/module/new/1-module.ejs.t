---
to: src/<%=h.changeCase.paramCase(h.inflection.pluralize(name))%>/<%=h.changeCase.paramCase(h.inflection.pluralize(name))%>.module.ts
---
<% single = h.changeCase.camel(h.inflection.singularize(name)) -%>
<% Single = h.changeCase.pascalCase(single) -%>
<% plural = h.changeCase.camel(h.inflection.pluralize(name)) -%>
<% Plural = h.changeCase.pascalCase(plural) -%>
import { Module } from '@nestjs/common'

import { <%=Plural%>Controller } from './<%=h.changeCase.paramCase(plural)%>.controller'
import { <%=Plural%>Service } from './<%=h.changeCase.paramCase(plural)%>.service'

@Module({
  controllers: [<%=Plural%>Controller],
  providers: [<%=Plural%>Service],
})
export class <%=Plural%>Module {}
