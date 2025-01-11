import {
  Table,
  Model,
  Column,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { Order } from 'models/Order';
import { OrderProduct } from 'models/OrderProduct';

@Table({
  tableName: 'products',
  underscored: true,
  timestamps: true,
})
export class Product extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
    unique: true,
  })
    uid!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
    name!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
    description!: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
    price!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    stock!: number;

  @BelongsToMany(() => Order, { through: () => OrderProduct, foreignKey: 'orderUid', as: 'products' })
    orders!: Order[];
}
