import {
  Column, DataType, ForeignKey, Table, Model,
} from 'sequelize-typescript';
import { Product } from 'models/Product';
import { Order } from 'models/Order';

@Table({
  tableName: 'order_products',
  underscored: true,
  timestamps: true,
})
export class OrderProduct extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
    unique: true,
  })
    uid!: string;

  @ForeignKey(() => Product)
  @Column({
    unique: false,
  })
    productUid!: string;

  @ForeignKey(() => Order)
  @Column({
    unique: false,
  })
    orderUid!: string;
}
