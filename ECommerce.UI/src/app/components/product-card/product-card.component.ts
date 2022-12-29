import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit{

  cartCount!: number;
  products: {
    product: Product, //how many of each thing is in the cart
    quantity: number //how many different things are in the cart
  }[] = [];
  subscription!: Subscription;
  totalPrice: number = 0;
  quantity: number = 0; //the value the user enters in the quanitity selection box

  @Input() productInfo!: Product;

  constructor(private productService: ProductService) { }
  
  ngOnInit(): void {
    this.subscription = this.productService.getCart().subscribe(
      (cart) => {
        this.cartCount = cart.cartCount;
        this.products = cart.products;
        this.totalPrice = cart.totalPrice;
      }
    );
  }

  addToCart(product: Product): void {
    //product is the item being clicked on
    let inCart = false;

    this.products.forEach(
      (element) => {
        console.log(element.quantity);
        if(element.product == product){
          //if the users quantity is less than the items max quantity minus whats in the cart for that specific item, then do stuff below
          if(this.quantity <= element.product.productQuantity - element.quantity && this.quantity > 0) {
            element.quantity += this.quantity;
            // console.log("element.quantity: " + element.quantity);
            // console.log("element.product.quantity: " + element.product.productQuantity);
            // console.log("product.quantity: " + product.productQuantity);
            let cart = {
              cartCount: this.cartCount += this.quantity,
              products: this.products,
              totalPrice: this.totalPrice + product.productPrice
            };
            this.productService.setCart(cart);
            inCart=true;
            return;
          }
          inCart=true;
        };
      }
    );

    if(inCart == false){

      if(this.quantity <= product.productQuantity && this.quantity > 0) {
        console.log("hi im running");
        let newProduct = {
          product: product,
          quantity: this.quantity,
        };
        this.products.push(newProduct);
        let cart = {
          cartCount: this.cartCount += this.quantity,
          products: this.products,
          totalPrice: this.totalPrice + product.productPrice
        }
        this.productService.setCart(cart);
        //product.productQuantity -= this.quantity;
      }
      else {
        console.log("error");
        //error message on the UI

      }
    }
      
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
