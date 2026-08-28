import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AuthGuard } from './auth.guard';

@UseGuards(AuthGuard)
@Controller('admin/appointments')
export class AdminAppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  async getPendingRequests() {
    return this.appointmentsService.getPendingRequests();
  }

  @Post(':id/decision')
  async makeDecision(
    @Param('id') id: string,
    @Body() body: { decision: 'APPROVED' | 'REJECTED' | 'UNAVAILABLE'; adminId: string; reason?: string }
  ) {
    return this.appointmentsService.makeDecision(id, body.decision, body.adminId, body.reason);
  }
}
