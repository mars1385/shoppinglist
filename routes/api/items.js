const express = require('express');
const router = express.Router();

//............auth............
const auth = require('../../middleware/auth');
//-----------models---------------------
const Item = require('../../models/Item');

//--------------routers--------------

//@route Get api/items
//@desc Get All Items
//@access Public
router.get('/' , (req , res) => { 
    Item.find()
        .sort({ dare : -1})
        .then(items => res.json(items));
});

//@route Post api/items
//@desc Create a Items
//@access Private
router.post('/' ,auth , (req , res) => { 
    const newItem = new Item({
        name : req.body.name
    });
    newItem.save().then(item => res.json(item));
});

//@route Delete api/items/:id
//@desc Delete a Items
//@access Private
router.delete('/:id' ,auth , (req , res) => { 
    const {id} = req.params;
    Item.findById(id)
        .then(item => {
            item.remove().then(() => res.json({delete : true}))
        })
        .catch(error => res.status(404).json({delete : false}));
});
//-------export---------------
module.exports = router;

