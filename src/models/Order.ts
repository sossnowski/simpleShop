import {
  Table,
  Model,
  Column,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { Product } from 'models/Product';
import { OrderProduct } from 'models/OrderProduct';

@Table({
  tableName: 'orders',
  underscored: true,
  timestamps: true,
})
export class Order extends Model {
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
    customerId!: string;

  @BelongsToMany(() => Product, { through: () => OrderProduct, foreignKey: 'orderUid', as: 'products' })
    products!: Product[];
}
