import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ForbiddenException,
  Delete,
} from '@nestjs/common';
import { ServiceJobService } from './service-job.service';
import {
  CreateServiceJobDto,
  AssignTechnicianDto,
  CreateRepairJobDto,
} from './dto/create-service-job.dto';
import { UpdateServiceJobStatusDto } from './dto/update-service-job-status.dto';
import { UpdateServiceJobDto } from './dto/update-service-job.dto';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { ModuleName, PermissionAction, ServiceJobStatus } from '@prisma/client';

@Controller('service-jobs')
export class ServiceJobController {
  constructor(private readonly serviceJobService: ServiceJobService) {}

  @RequirePermission({
    module: ModuleName.SALES,
    action: PermissionAction.READ,
  })
  @Get('next-invoice-number')
  getNextInvoiceNo() {
    return this.serviceJobService.getNextInvoiceNo();
  }

  @RequirePermission({
    module: ModuleName.SALES,
    action: PermissionAction.READ,
  })
  @Get()
  findAll(
    @CurrentUser() user: JwtPayload,
    @Query('status') status?: ServiceJobStatus,
    @Query('branch') branch?: string,
    @Query('technicianId') technicianId?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const isTech = user.roleName?.toLowerCase().includes('technician');
    const effectiveTechId = isTech ? user.sub : technicianId;

    // Scoping for Branch Admin
    const isGlobal = (user as any).roleScope === 'GLOBAL';
    const effectiveBranch = !isGlobal && user.branchId ? user.branchId : branch;

    return this.serviceJobService.findAll({
      status,
      branch: effectiveBranch,
      technicianId: effectiveTechId,
      search,
      page,
      limit,
      startDate,
      endDate,
    });
  }

  @RequirePermission({
    module: ModuleName.SALES,
    action: PermissionAction.READ,
  })
  @Get('my')
  findMy(@CurrentUser() user: JwtPayload) {
    if (!user || user.userType !== 'STAFF') {
      throw new ForbiddenException('Staff authentication required.');
    }
    return this.serviceJobService.findMy(user.sub);
  }

  @RequirePermission({
    module: ModuleName.SALES,
    action: PermissionAction.CREATE,
  })
  @Post('repair')
  createRepairJob(
    @Body() dto: CreateRepairJobDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.serviceJobService.createRepairJob(dto, user);
  }

  @RequirePermission({
    module: ModuleName.SALES,
    action: PermissionAction.CREATE,
  })
  @Post()
  create(@Body() dto: CreateServiceJobDto) {
    return this.serviceJobService.create(dto);
  }

  @RequirePermission({
    module: ModuleName.SALES,
    action: PermissionAction.READ,
  })
  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const job = await this.serviceJobService.findOne(id);
    const isTech = user.roleName?.toLowerCase().includes('technician');
    if (isTech && (!job || job.technicianId !== user.sub)) {
      throw new ForbiddenException(
        'Access denied: You can only view your own service jobs',
      );
    }
    return job;
  }

  @RequirePermission({
    module: ModuleName.SALES,
    action: PermissionAction.UPDATE,
  })
  @Patch(':id/assign')
  assignTechnician(@Param('id') id: string, @Body() dto: AssignTechnicianDto) {
    return this.serviceJobService.assignTechnician(id, dto);
  }

  @RequirePermission({
    module: ModuleName.SALES,
    action: PermissionAction.UPDATE,
  })
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateServiceJobStatusDto,
  ) {
    return this.serviceJobService.updateStatus(id, dto);
  }

  @RequirePermission({
    module: ModuleName.SALES,
    action: PermissionAction.UPDATE,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateServiceJobDto) {
    return this.serviceJobService.update(id, dto);
  }

  @RequirePermission({
    module: ModuleName.SALES,
    action: PermissionAction.DELETE,
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceJobService.remove(id);
  }
}
