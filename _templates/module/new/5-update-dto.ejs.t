---
to: src/<%=h.changeCase.paramCase(h.inflection.pluralize(name))%>/dto/update-<%=h.changeCase.paramCase(h.inflection.singularize(name))%>.dto.ts
---
<% single = h.changeCase.camel(h.inflection.singularize(name)) -%>
<% Single = h.changeCase.pascalCase(single) -%>
<% plural = h.changeCase.camel(h.inflection.pluralize(name)) -%>
<% Plural = h.changeCase.pascalCase(plural) -%>
import { PartialType } from '@nestjs/mapped-types';

import { Create<%=Single%>Dto } from './create-<%=h.changeCase.paramCase(h.inflection.singularize(name))%>.dto'

export class Update<%=Single%>Dto extends PartialType(Create<%=Single%>Dto) {}
