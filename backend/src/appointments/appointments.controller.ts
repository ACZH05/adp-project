import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AuthGuard } from './auth.guard';

@UseGuards(AuthGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async createRequest(
    @Body() body: { applicantId: string; applicationId: string; requestedDate: string; requestedTime: string; notes?: string }
  ) {
    return this.appointmentsService.createAppointmentRequest({
      applicantId: body.applicantId,
      applicationId: body.applicationId,
      requestedDate: new Date(body.requestedDate),
      requestedTime: body.requestedTime,
      notes: body.notes,
    });
  }

  @Get(':applicationId/status')
  async getStatus(@Param('applicationId') applicationId: string) {
    return this.appointmentsService.getAppointmentStatus(applicationId);
  }
}
