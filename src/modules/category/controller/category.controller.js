
import categoryModel from "../../../../db/Models/category.js";
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid'; 
import userModel from "../../../../db/Models/user.js";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, uuidv4() +"_"+ file.originalname);
    }
  })
  
const upload = multer({ storage: storage })
export const addimg=upload.single('categoryImage')
// ************************************* addCategory
export const addCategory = async (req, res) => {
    const { categoryName, categoryImage } = req.body;
    const createdBy = await userModel.findById(req.body.createdBy)
    const foundedCategory = await categoryModel.findOne({
      categoryName: categoryName,
      
    });
    if (foundedCategory) return res.send({ message: "category already exists" });
    const newCategory = await categoryModel.insertMany({
      categoryName,
      categoryImage:"http://localhost:5000/uploads/"+req.file.filename,
      createdBy,
    });
    res.send({ message: "category created", category: newCategory });
  };

// ************************************* updateCategory
export const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { categoryName, categoryImage, createdBy } = req.body;

    // Check if the category exists
    const existingCategory = await categoryModel.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Update category details
    existingCategory.categoryName = categoryName;
    existingCategory.categoryImage = categoryImage ? "http://localhost:5000/uploads/" + req.file.filename : existingCategory.categoryImage;
    existingCategory.createdBy = createdBy;

    // Save the updated category
    const updatedCategory = await existingCategory.save();

    res.json({ message: 'Category updated successfully', category: updatedCategory });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};
// /////////////////////////////****************** */

// export const updateCategory = async (req, res) => {
//   try {
//     const categoryId = req.params.id;
//     const { categoryName, image } = req.body;
//     const category = await Categorymodel.findById(categoryId);

//     if (!category) {
//       return res.json({ message: "category not found" });
//     }
//     if (category.createdBy == req.createdBy) {
//       await Categorymodel.findByIdAndUpdate(categoryId, {
//         categoryName,
//         image,
//       });
//       const newCategory = await Categorymodel.findById(categoryId);
//       res.send({ newCategory: newCategory });
//     } else {
//       res.send({ message: "Not authorized to update this category" });
//     }
//   } catch (error) {
//     res.send({ error: error.message });
//   }
// };
// // Update category
// export const updateCategory = async (req, res) => {
//   try {
//       const categoryId = req.params.categoryId;
//       const { categoryName, categoryImage } = req.body;

//       const category = await categoryModel.findById(categoryId);


//       console.log('category:', category);

//       if (!category) {
//           return res.status(404).json({ status: 'FAIL', data: { message: 'Category not found' } });
//       }

//       // Check if the logged-in user is the owner of the category or admin
//       if (category.createdBy.toString() !== req.userid || req.userRole !=="admin") {
//           return res.status(403).json({ status: 'FAIL', data: { message: 'You do not have permission to update this category' } });
//       }

//       // Update the category
//       const updateCategory = await categoryModel.findOneAndUpdate(
//           { _id: categoryId, createdBy: req.userid },
//           { $set: { categoryName, categoryImage } }, 
//           { new: true }
//       );

//       if (!updateCategory) {
//           return res.status(404).json({ status: 'FAIL', data: { message: 'Category not found' } });
//       }

//       res.status(200).json({ status: 'SUCCESS', data: { updateCategory } });
//   } catch (error) {
//       console.error(error); // Log the error for debugging
//       res.status(500).json({ status: 'ERROR', message: error.message, data: null });
//   }
// };

// ************************************ deleteCategory

export const deleteCategory = async (req, res) => {
  try {
      const categoryId = req.params.id;

      const deletedCategory = await categoryModel.findByIdAndDelete(categoryId);

      if (deletedCategory) {
          res.json({ message: 'category deleted successfully', category: deletedCategory });
      } else {
          res.status(404).json({ message: 'category not found' });
      }
  } catch (error) {
      res.status(500).json({ message: error.message, data: null });
  }
};

//  ************************************** GetALlCategory

export const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    res.json({ message: 'Categories retrieved successfully', categories });
  } catch (error) {
    res.status(500).json({ message: error.message, data: null });
  }
};

//  ************************** Get specific category by name

export const getCategoryByKey = async function (req, res) {
  try {
    const { key } = req.params
    const data = await categoryModel.find({ categoryName: { $regex: key } })
    if (!data.length) {
      return res.status(404).send("Unable to find")
    }
    return res.send(data)
  } catch (error) {
    res.status(400).send(error)
  }
}

// *********************************** get specific category by id

export const getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await categoryModel.findById(categoryId);

    if (category) {
      res.json({ message: 'Category retrieved successfully', category });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};