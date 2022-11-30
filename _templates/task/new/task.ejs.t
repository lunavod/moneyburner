---
to: src/tasks/<%= type %>/<%= h.changeCase.camel(name) %>.task.ts
---
import { TaskRunner } from 'src/tasks/task-manager'
import { ClickHouseLogger } from 'src/tools/clickhouse.logger'<% if (prisma) { %>
import { PrismaService } from 'src/prisma.service'<% } %>
<% if (useData) { %>
interface <%= Name %>Data {
  
}
<% } %>
@TaskRunner('<%= h.changeCase.camel(name) %>')
export class <%= Name %> {
  private logger: ClickHouseLogger
<% if (prisma) { %>
  constructor(private prisma: PrismaService) {}
<% } %><% if (useData) { %>
  data: <%= Name %>Data
<% } %>
  async main(task, run, logger) {
    this.logger = logger<% if (useData) { %>
    this.data = task.data<% } %>
    
    this.logger.log('DONE')
  }
}
