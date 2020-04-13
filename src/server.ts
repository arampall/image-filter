import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import validUrl = require('valid-url');

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  app.get('/filteredimage', async(req: Request, res: Response) => {
    let imageUrl: string = req.query.image_url;
    console.log(imageUrl);
    if(!imageUrl){
      res.status(404).send('Image Url not found. Please provide a valid image url');
    }
  
    if(!validUrl.isUri(imageUrl)){
      console.log('It is an invalid Uri');
      res.status(400).send('Bad Request... please correct the Image URL and retry the request');
    }
 
    try{
      let absFilePath: string = await filterImageFromURL(imageUrl);
      res.status(200).sendFile(absFilePath, function(){
          deleteLocalFiles([absFilePath])
      });
    }
    catch(error){
      console.error(error);
      res.status(400).send("System could not handle the request. It is either that the system cannot find any image at the given location or the server took too long to respond.");
    }

  });

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();