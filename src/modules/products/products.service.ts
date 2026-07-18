import { ProductsRepository } from "./products.repository";
import { AppError } from "../../core/errors/app-error";


export class ProductsService {

    private repository =
        new ProductsRepository();


    async getAll(){
        return this.repository.findAll();
    }


    async getById(id:number){

        const product =
            await this.repository.findById(id);


        if(!product){
            throw new AppError(
                "Product tidak ditemukan",
                404
            );
        }


        return product;
    }


    async create(data:any){

        return this.repository.create(data);

    }


    async update(
        id:number,
        data:any
    ){

        await this.getById(id);

        return this.repository.update(
            id,
            data
        );
    }


    async delete(id:number){

        await this.getById(id);

        await this.repository.delete(id);


        return {
            message:
            "Product berhasil dihapus"
        };
    }
}