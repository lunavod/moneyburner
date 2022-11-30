---
to: src/<%=h.changeCase.paramCase(h.inflection.pluralize(name))%>/<%=h.changeCase.paramCase(h.inflection.pluralize(name))%>.service.ts
---
<% single = h.changeCase.camel(h.inflection.singularize(name)) -%>
<% Single = h.changeCase.pascalCase(single) -%>
<% plural = h.changeCase.camel(h.inflection.pluralize(name)) -%>
<% Plural = h.changeCase.pascalCase(plural) -%>
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class <%=Plural%>Service {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.<%=Single%>UncheckedCreateInput) {
    return this.prisma.<%=single%>.create({ data })
  }

  findAll() {
    return this.prisma.<%=single%>.findMany()
  }

  findOne(id: string) {
    return this.prisma.<%=single%>.findUnique({ where: { id } })
  }

  update(id: string, data: Prisma.<%=Single%>UncheckedUpdateInput) {
    return this.prisma.<%=single%>.update({ where: { id }, data })
  }

  remove(id: string) {
    return this.prisma.<%=single%>.delete({ where: { id } })
  }
}
