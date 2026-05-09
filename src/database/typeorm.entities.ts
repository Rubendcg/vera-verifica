import { Party } from '../modules/parties/entities/party.entity';
import { User } from '../modules/users/entities/user.entity';
import { UserVehicleAccess } from '../modules/vehicles/entities/user-vehicle-access.entity';
import { VehiclePartyRole } from '../modules/vehicles/entities/vehicle-party-role.entity';
import { Vehicle } from '../modules/vehicles/entities/vehicle.entity';

export const typeOrmEntities = [
  Party,
  User,
  Vehicle,
  VehiclePartyRole,
  UserVehicleAccess,
];
