
import productModel from "../../../../db/Models/product.js";
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid'; 
import categoryModel from "../../../../db/Models/category.js";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, uuidv4() +"_"+ file.originalname);
    }
  })
  
const upload = multer({ storage: storage })
export const addimg=upload.single('productImage')

export const addProduct = async (req, res) => {
    try {
      const {
        productName,
        slug,
        priceAfterDiscount,
        productPrice,
        stock,
      } = req.body;
      const category = await categoryModel.findById(req.body.category)
      if (!category) res.send({ message: "this category does not exist" });

      const newProduct = new productModel({
        productName,
        slug,
        priceAfterDiscount,
        productPrice,
        category:category._id,
        stock,
        productImage:"http://localhost:5000/uploads/"+req.file.filename,
        
      });
  
      const addedProduct = await newProduct.save();
  
      res.json({ message: 'Product added successfully', addedProduct });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
// ****************************************update product 


export const updateProduct = async (req, res) => {
  try {
      const productId = req.params.productId;
      const updateData = req.body;

      console.log("Product ID:", productId);
      console.log("Update Data:", updateData);

      // Update the product
      const updatedProduct = await productModel.findByIdAndUpdate(productId, updateData, { new: true });

      console.log("Updated Product:", updatedProduct);

      if (updatedProduct) {
          res.json({ message: 'Product updated successfully', product: updatedProduct });
      } else {
          res.status(404).json({ message: 'Product not found' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete Product
  export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const deletedProduct = await productModel.findByIdAndDelete(productId);

        if (deletedProduct) {
            res.json({ message: 'Product deleted successfully', product: deletedProduct });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message, data: null });
    }
};


// Get all product with paginate

export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;

    const skip = (page - 1) * pageSize;
    
    // Fetch products with pagination
    const products = await productModel
      .find()
      .skip(skip)
      .limit(parseInt(pageSize))
      .exec();

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//Get specific product by name

export const getProductByKey = async function (req, res) {
  try {
    const { key } = req.params
    const data = await productModel.find({ productName: { $regex: key } })
    if (!data.length) {
      return res.status(404).send("Unable to find")
    }
    return res.send(data)
  } catch (error) {
    res.status(400).send(error)
  }
}

// Get all product that in the same category

// export const getProductsByCategory = async (req, res) => {
//   try{
//     const { category } = req.body;
//    const theCategory = await categoryModel.findOne({ categoryName: category });
//    if (!theCategory) {
//      return res.send({ message: "this category does not exist" });
//    } else {
//      const products = await productModel.find({ category: theCategory._id }).populate("category");
//      res.send({ category: category, data: products });
//    }
//    }catch(error) {
//        console.error(error);
//        res.status(500).json({ error: 'Internal Server Error' });
//    }
//  };

export const getProductsByCategory = async (req, res) => {
  try{
    const { category } = req.body;
   const theCategory = await categoryModel.findOne({ categoryName: category });
   if (!theCategory) {
     return res.send({ message: "this category does not exist" });
   } else {
     const products = await productModel.find({ category: theCategory._id }).populate("category");
     res.send({ category: category, data: products });
   }
   }catch(error) {
       console.error(error);
       res.status(500).json({ error: 'Internal Server Error' });
   }
 };