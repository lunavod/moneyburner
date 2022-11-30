---
to: src/<%=h.changeCase.paramCase(h.inflection.pluralize(name))%>/<%=h.changeCase.paramCase(h.inflection.pluralize(name))%>.controller.ts
---
<% single = h.changeCase.camel(h.inflection.singularize(name)) -%>
<% Single = h.changeCase.pascalCase(single) -%>
<% plural = h.changeCase.camel(h.inflection.pluralize(name)) -%>
<% Plural = h.changeCase.pascalCase(plural) -%>
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { User } from '@prisma/client'
import { GetUser } from 'src/auth/user.decorator'

import { Create<%=Single%>Dto } from './dto/create-<%=h.changeCase.paramCase(single)%>.dto'
import { Update<%=Single%>Dto } from './dto/update-<%=h.changeCase.paramCase(single)%>.dto'
import { <%=Plural%>Service } from './<%=h.changeCase.paramCase(plural)%>.service'

@Controller('<%=h.changeCase.paramCase(plural)%>')
export class <%=Plural%>Controller {
  constructor(private readonly <%=plural%>Service: <%=Plural%>Service) {}

  @Post()
  create(@Body() create<%=Single%>Dto: Create<%=Single%>Dto, @GetUser() user: User) {
    return this.<%=plural%>Service.create({ ...create<%=Single%>Dto, userId: user.id })
  }

  @Get()
  findAll() {
    return this.<%=plural%>Service.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.<%=plural%>Service.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() update<%=Single%>Dto: Update<%=Single%>Dto) {
    return this.<%=plural%>Service.update(id, update<%=Single%>Dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.<%=plural%>Service.remove(id)
  }
}
