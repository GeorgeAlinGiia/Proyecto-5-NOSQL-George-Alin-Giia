console.log('>> RUTAS CARGADAS:', __filename);
const express = require('express');
const mongoose = require('mongoose');
const Movie = require('/models/Movie.js');
const router = express.Router();

router.get('/ping', (req, res) => res.send('pong'));
router.post('/echo', (req, res) => res.json({ received: req.body }));

router.get('/list/', async (req, res, next) => {
	try {
		const movies = await Movie.find();
		return res.status(200).json(movies)
	} catch (error) {
		return next(error)
	}
});
 router.get('/id/:id', async (req, res) => {
	const id = req.params.id;
	try {
		const movie = await Movie.findById(id);
		if (movie) {
			return res.status(200).json(movie);
		} else {
			return res.status(404).json('Not movie found by this id');
		}
	} catch (err) {
		return res.status(500).json(err);
	}
});
router.get('/title/:title', async (req, res) => {
	const {title} = req.params;

	try {
		const MovieByTitle = await Movie.find({ title: title });
		return res.status(200).json(MovieByTitle);
	} catch (err) {
		return res.status(500).json(err);
	}
});


 router.get('/genre/:genre', async (req, res) => {
	const {genre} = req.params;

	try {
		const MovieByGenre = await Movie.find({ genre: genre });
		return res.status(200).json(MovieByGenre);
	} catch (err) {
		return res.status(500).json(err);
	}
});


 router.get('/date/:year', async (req, res) => {
	const {year} = req.params;

	try {
		const MovieByDate = await Movie.find({ year: { $gte:year } });
		return res.status(200).json(MovieByDate);
	} catch (err) {
		return res.status(500).json(err);
	}
});

 router.get('/date/', async (req, res) => {

	try {
		const MovieByDate = await Movie.find({ year: { $gte:2010 } });
		return res.status(200).json(MovieByDate);
	} catch (err) {
		return res.status(500).json(err);
	}
});

router.post('/create/', async (req, res, next) => {
    console.log('BODY >>', req.body);
	try {
    
      const newMovie = new Movie({
        title: req.body.title,
        director: req.body.director,
        year: req.body.year,
        genre: req.body.genre
      });
  
      const createdMovie = await newMovie.save();
      return res.status(201).json(createdMovie);
    } catch (error) {
    
      next(error);
    }
  });

router.put('/edit/id/:id', async (req, res, next) => {
    try {
        const { id } = req.params 
        const movieModify = new Movie(req.body) 
        movieModify._id = id 
        const movieUpdated = await Movie.findByIdAndUpdate(id , movieModify)
        return res.status(200).json(movieUpdated)
    } catch (error) {
        return next(error)
    }
});

 

  router.delete('/id/:id', async (req, res, next) => {
    try {
        const {id} = req.params;
        
        await Movie.findByIdAndDelete(id);
        return res.status(200).json('Movie deleted!');
    } catch (error) {
        return next(error);
    }
});




module.exports = router;