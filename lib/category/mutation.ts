import { prisma } from "../prisma-client";
import { categorySchema } from "../zodSchema";

export async function createCategory(data: {name: string, description?: string}){

   try {
     const {name , description} = data;

    const validateData = categorySchema.safeParse(data);

    if(!validateData.success){
        const msg = validateData.error.issues.map(issue => issue.message).join(", ");
        return {
            success: false,
            message: msg || "Invalid data"
        } 
    }
const softDeleteCategory = await prisma.category.findFirst({
    where:{
        name,
        deletedAt: {
            not: null
        }
    }

});
if(softDeleteCategory){
    const restoredCategory = await prisma.category.update   ({
        where:{id: softDeleteCategory.id},
        data:{
            deletedAt: null,
            description,
        }
    })
    return {status: 200, data: restoredCategory}
}
const newcategory = await prisma.category.create({
    data:{
        name,
        description,
    }
})
if(!newcategory){
    return {status: 500, errors: "Failed to create category"}
}
return {status: 200, data: newcategory}
   } catch (error) {
       return {status: 500, message: "Failed to create category"}
   }
}

export async function updateCategory({data,id}: {data:any, id:number}) {

    try {
        const {name,description} = data;

const category = await prisma.category.update({
    where:{
        id,
    },
    data:{
        name,
        description
    }
})

if(!category){
    return {status: 500, errors: "Failed to update category"}
}
return {status: 200, data: category}

    } catch (error) {
        return {status: 500, message: "Failed to update category"}
    }
}

export async function deleteCategory(id: number) {
  const category = await prisma.category.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  // const product = await prisma.product.updateMany({
  //   where: { categoryId: id },
  //   data: { categoryId:  },
  // });

  // if (!product) return { errors: "Delete data failed", status: 500 };
  if (!category) return { errors: "Delete data failed", status: 500 };
  return { data: category, status: 200 };
}
