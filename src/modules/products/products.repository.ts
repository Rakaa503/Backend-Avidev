import { prisma } from "../../core/database/prisma";


export class ProductsRepository {

    async findAll() {
        return prisma.product.findMany();
    }


    async findById(id:number) {
        return prisma.product.findUnique({
            where:{
                id,
            },
        });
    }


    async create(data:{
        name:string;
        price:number;
        stock:number;
    }) {
        return prisma.product.create({
            data,
        });
    }


    async update(
        id:number,
        data:any
    ){
        return prisma.product.update({
            where:{
                id,
            },
            data,
        });
    }


    async delete(id:number){
        return prisma.product.delete({
            where:{
                id,
            },
        });
    }
}