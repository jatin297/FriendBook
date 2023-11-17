
const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

// @desc Get all contacts
// @route GET /api/contacts
// @access private
const getContacts = asyncHandler(async(req,res) => {
    const contacts = await Contact.find({user_id:req.user.id});
    res.status(200).json(contacts)
})

// @desc create contact
// @route POST /api/contacts
// @access private
const createContact = asyncHandler(async(req,res) => {
    const {name,phone,email} = req.body;
    if(!name || !phone || !email)
    {
        res.status(400)
        throw new Error("All Fields are mandatory")
    }
    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id:req.user.id
    })
    res.status(200).json(contact)
})

// @desc get contact id
// @route GET /api/contacts/id
// @access private
const getContact = asyncHandler(async(req,res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact Not Found");
    }
    res.status(200).json(contact)
})

// @desc update contact id
// @route PUT /api/contacts/id
// @access private
const updateContact = asyncHandler(async(req,res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact Not Found");
    }

    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("User don't have permission to update")
    }
    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    );
    res.status(200).json(updatedContact)
})

// @desc delete contact id
// @route DELETE /api/contacts/id
// @access private
const deleteContact = asyncHandler(async(req,res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact Not Found");
    }
    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("User don't have permission to delete")
    }
    await Contact.findByIdAndDelete(
        req.params.id,
        {new:true}
    );
    res.status(200).json(contact)
})


module.exports = {
    getContacts,
    createContact,
    getContact,
    updateContact,
    deleteContact
}
