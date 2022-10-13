const fs = require('fs');

class Cart{
    constructor(url){
        this.url = url;
        this.carts = [];
    }

    async #readFile(){
        try{
            const content = await fs.promises.readFile(this.url, 'utf-8');
            return JSON.parse(content);
        }catch(e){
            return {'Error': 'File not Found' };
        }
    }

    async createCart(){
        const id = Math.floor(Math.random()*500);
        const today = new Date();
        const date = today.toLocaleString('en-GB');
        try{
            const arch = await this.#readFile();
            await fs.promises.writeFile(this.url, JSON.stringify([...arch,{...this.carts, id: id, timestamp: date, products: []}], null, 2), 'utf-8');
            return id;
        }catch(e){
            return {'Error': 'File not Found' };
        }

    }

    async getById(id){
        try{
            const arch = await this.#readFile();
            const cart = arch.find(cart => cart.id === parseInt(id));
            if(cart !== undefined)
                return cart;
        }catch(e){
            return {'Error': 'Cart not found.'};
        }
    }

    async deleteCart(id){
        try{    
            const arch = await this.#readFile();
            const cartNotDeleted = arch.filter(cart => cart.id !== parseInt(id));
            await fs.promises.writeFile(this.url, JSON.stringify(cartNotDeleted, null, 4), 'utf-8');
            return {'Message': 'Removed cart.'};
        }catch(e){
            return {'Error': 'Cart not found.'};
        }
    }

    async getCartProducts(id){
        const cart = await this.getById(id);
        if(!cart.Error){
            if(cart.products.length !== 0)
                return cart.products;
            else
                return {'Error': 'Empty cart.'};
        }
        return {'Error': 'Cart not found.'};
    }

    async addProductToCart(id, product){
        try{
            const arch = await this.#readFile();
            const cart = await this.getById(id);
            const newArch = arch.filter(carts => carts.id !== parseInt(id))
            product.then(resp => fs.promises.writeFile(this.url, JSON.stringify([...newArch,{...cart, products: resp}], null, 4), 'utf-8'));
            return {'Cart': 'Product added to cart successfully'};
        }catch(e){  
            return {'Error': 'Cart not found.'};
        }
    }

    async deleteProductInToCart(idCart, idProd){
        try{
            const arch = await this.#readFile();
            const cart = await this.getById(idCart);
            const products = cart.products.filter(prod => prod.id !== parseInt(idProd));
            if(products.length === 0){
                return {'Error': 'Products not found.'};
            }
            const newArch = arch.filter(carts => carts.id !== parseInt(idCart))
            await fs.promises.writeFile(this.url, JSON.stringify([...newArch,{...cart, products: products}], null, 4), 'utf-8');
            return {'Cart': 'Product deleted.'};
        }catch(e){
            return {'Error': 'Cart not found.'};
        }
    }
};


module.exports = Cart;