import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
    @Get()
    findAll() {
        return this.usersService.findAll(); 
    }
   

    @Get('profile')
    getProfile() {
        return 'Ini Profile';
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return `User ID = ${id}`;
    }
}