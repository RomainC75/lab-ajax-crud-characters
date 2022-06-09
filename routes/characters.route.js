const router = require('express').Router()
const { response } = require('../app')
const Character = require('../models/Character.model')
/**
 * !All the routes here are prefixed with /api/characters
 */

/**
 * ? This route should respond with all the characters
 */
router.get('/', async(req, res, next) => {
  try {
    const ans = await Character.find({})
    console.log('-->',ans)
    res.status(200).json(ans)
  } catch (error) {
    next(error)
  }
})

/**
 * ? This route should create one character and respond with 
 * ? the created character
 */
const possibleKeys = ['name','occupation','weapon','cartoon']

router.post('/', async (req, res, next) => {
  try {
    //test request
    console.log('RECEIVED BODY : ', req.body)
    const missingKeys = possibleKeys.filter( key => !Object.keys(req.body).includes(key) )
    console.log('missingKeys : ', missingKeys)
    if( req.body && missingKeys.length===0 ){
      console.log('post /characters', req.body)
      const ans = await Character.create(req.body)
      res.status(200).json(ans)
    }else{
      res.status(401).json({message : `missing keys : ${JSON.stringify(missingKeys)}`})
    }
  } catch (error) {
    next(error)
  }
})

/**
 * ? This route should respond with one character
 */
router.get('/:name', async(req, res, next) => {
  try {
    console.log('get/:id --> ',req.params.id)
    const reg = new RegExp(req.params.name,'i')
    const ans = await Character.find({name:{$regex:reg}})
    res.status(200).json(ans)
  }catch (error){
    next(error)
  }
})

/**
 * ? This route should update a character and respond with
 * ? the updated character
 */
router.patch('/:id', async (req, res, next) => {
  console.log('PATCH : ',req.body)
  try {
    //test request
    const ans = await Character.findByIdAndUpdate(req.params.id,req.body,{new:true})
    if(ans){
      res.status(200).json(ans)
    }else{
      res.status(401).json(ans)
    }
  } catch (error) {
    next(error)
  }
})

/**
 * ? Should delete a character and respond with a success or
 * ? error message
 */
router.delete('/:id', async(req, res, next) => {
  try {
    console.log('delete route :! ')
    const ans = await Character.findByIdAndDelete(req.params.id)
    console.log(ans)
    if(ans!=null){
      res.status(200).json({message : "character erased ! "})
    }else{
      next()
    }
    
  } catch (error) {
    next(error)
  }
})


module.exports = router