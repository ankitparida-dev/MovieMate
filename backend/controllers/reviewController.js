const Review = require("../models/Review");
const User = require("../models/User");
const getMovieReviews = async (req,res)=>{
    try{

        const reviews = await Review.find({
            mediaId:req.params.mediaId
        }).sort({
            createdAt:-1
        });

        res.json(reviews);

    }catch(error){
        res.status(500).json({
            success:false,
            error:error.message
        });
    }
};
const createReview = async(req,res)=>{
    try{

        const {
            mediaId,
            mediaType,
            title,
            content,
            rating,
            spoiler
        } = req.body;

        const user = await User.findById(
            req.user.id
        );

        const review =
            await Review.create({

                userId:req.user.id,
                userName:user.name,

                mediaId,
                mediaType,
                title,
                content,
                rating,
                spoiler
            });

        res.status(201).json(review);

    }catch(error){

        res.status(500).json({
            success:false,
            error:error.message
        });

    }
};
const deleteReview = async(req,res)=>{
    try{

        const review =
            await Review.findById(
                req.params.id
            );

        if(!review){
            return res.status(404).json({
                message:"Review not found"
            });
        }

        if(
            review.userId.toString()
            !== req.user.id
        ){
            return res.status(403).json({
                message:"Unauthorized"
            });
        }

        await review.deleteOne();

        res.json({
            success:true
        });

    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }
};
const likeReview = async(req,res)=>{
    const likeReview = async (req, res) => {
    console.log("REQ.USER =", req.user);
    console.log("REQ.PARAMS =", req.params);
}

    const review =
        await Review.findByIdAndUpdate(
            req.params.id,
            {
                $inc:{
                    likes:1
                }
            },
            {
                new:true
            }
        );

    res.json(review);
};
const markHelpful = async(req,res)=>{

    const review =
        await Review.findByIdAndUpdate(
            req.params.id,
            {
                $inc:{
                    helpful:1
                }
            },
            {
                new:true
            }
        );

    res.json(review);
};
module.exports = {
    getMovieReviews,
    createReview,
    deleteReview,
    likeReview,
    markHelpful
};