import { Injectable, NotFoundException } from '@nestjs/common';

import { Product } from './product.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  private products: Product[] = [];
  /*here  inside the injectable method we define product which is mention inside product.module name='product'*/
  constructor(
    @InjectModel('product')
    private readonly productModel: Model<Product>,
  ) {}

  async insertProduct(title: string, desc: string, price: number) {
    const prodId = Math.random().toString();
    const newProduct = new this.productModel({
      title: title,
      description: desc,
      price: price,
    });
    const result = await newProduct.save();
    console.log(`Here Show result from insertProduct ${result}`);
    return result.id;
  }

  async getProducts() {
    const products = await this.productModel.find();
    console.log(products);
    return products.map((prod) => ({
      id: prod.id,
      title: prod.title,
      description: prod.description,
      price: prod.price,
    }));
  }

  async getSingleProduct(productId: string) {
    const product = await this.findProduct(productId);
    return product;
  }

  async updateProduct(
    productId: string,
    title: string,
    desc: string,
    price: number,
  ) {
    const updatedProduct = await this.findProduct(productId);

    if (title) {
      updatedProduct.title = title;
    }
    if (desc) {
      updatedProduct.description = desc;
    }
    if (price) {
      updatedProduct.price = price;
    }
    updatedProduct.save();
  }
  async deleteProduct(prodId: string) {
    let removedProduct = await this.productModel.findOneAndDelete({
      _id: prodId,
    });
    if (!removedProduct) {
      throw new NotFoundException('Please Insert id');
    }
    // `${removedProduct.title}'s Data Deleted Successfully`
    console.log(removedProduct);
  }

  private async findProduct(id: string): Promise<Product> {
    let product;
    try {
      product = await this.productModel.findById(id);
    } catch (err) {
      throw new NotFoundException('Could not find products.');
    }
    if (!product) {
      throw new NotFoundException('Could not find products.');
    }
    return product;
  }
}
