import { Controller, Get, Post, Patch, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Roles(Role.applicant)
  @Get('available-slots')
  getAvailableSlots(@Query('date') date: string) {
    if (!date) {
      date = new Date().toISOString().split('T')[0];
    }
    return this.appointmentService.getAvailableSlots(date);
  }

  @Roles(Role.applicant)
  @Get('eligible-applications')
  getEligibleApplications(@Req() req: any) {
    return this.appointmentService.getEligibleApplications(req.user.userId);
  }

  @Roles(Role.applicant)
  @Get('applicant')
  getApplicantAppointments(@Req() req: any) {
    return this.appointmentService.getApplicantAppointments(req.user.userId);
  }

  @Roles(Role.applicant)
  @Post()
  requestAppointment(@Body() body: { applicationId: string; startAt: string; endAt: string }, @Req() req: any) {
    return this.appointmentService.requestAppointment(
      req.user.userId,
      body.applicationId,
      body.startAt,
      body.endAt,
      req.ip,
      req.headers['user-agent']
    );
  }

  @Roles(Role.officer, Role.admin)
  @Get('officer/pending')
  getPendingRequests() {
    return this.appointmentService.getPendingRequests();
  }

  @Roles(Role.officer, Role.admin)
  @Patch('officer/:id/decision')
  decideAppointment(
    @Param('id') id: string,
    @Body() body: { decision: 'approve' | 'reject'; reason?: string },
    @Req() req: any
  ) {
    return this.appointmentService.decideAppointment(
      id,
      req.user.userId,
      body.decision,
      body.reason,
      req.ip,
      req.headers['user-agent']
    );
  }
}
