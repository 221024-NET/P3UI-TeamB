import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  products: {
    product: Product,
    quantity: number
  }[] = [];
  totalPrice!: number;

  cartProducts: Product[] = [];

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.productService.getCart().subscribe(
      (cart) => {
        this.products = cart.products;
        this.products.forEach(
          (element) => this.cartProducts.push(element.product)
        );
        this.totalPrice = cart.totalPrice;
      }
    );
  }

  emptyCart(): void {
    let cart = {
      cartCount: 0,
      products: [],
      totalPrice: 0.00
    };
    this.productService.setCart(cart);
    this.router.navigate(['/home']);
  }

  removeItem(product: Product, quantity: number): void {
    
    if(product.productPrice*quantity <= 0){
      this.totalPrice = 0;
    }else{
    this.totalPrice -= (product.productPrice * quantity);
    }
    if(this.totalPrice < 0){
      this.totalPrice =0;
    }

    this.products.forEach(
      (element) => {
        if(element.product == product){
            this.products.pop();
        }});

        let cart = {
          cartCount: this.products.length,
          products: this.products,
          totalPrice: this.totalPrice
        };
        this.productService.setCart(cart);



    

  }

}
