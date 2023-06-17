const express = require('express');
const app = express();
app.use(express.urlencoded());
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const kaltura = require('kaltura-client');
const config = new kaltura.Configuration();
const client = new kaltura.Client(config);


let secret = "8350c4e475539d57ed054817d99efad6";
let userId = "mjmuhamm93@gmail.com";
let type = kaltura.enums.SessionType.ADMIN;
let partnerId = 4377653;
let expiry = 86400;
let privileges = "";









// kaltura.services.media.add(entry)
// .execute(client)
// .then(result => {
//     console.log(result);
//
// 	let entryId = result.id;
// 	let resource = new kaltura.objects.UrlResource();
// 	resource.url = "https://example.com/catVideo.mp4";
//
// 	kaltura.services.media.addContent(entryId, resource)
// 	.execute(client)
// 	.then(result => {
// 	    console.log(result);
// 	});
// });








app.post('/get-user-videos', async (req, res) => {
  kaltura.services.session.start(secret, userId, type, partnerId, expiry, privileges)
  .execute(client)
  .then(result => {
    client.setKs(result)

    let filter = new kaltura.objects.MediaEntryFilter();
  filter.nameLike = req.body.name;
  let pager = new kaltura.objects.FilterPager();

  kaltura.services.media.listAction(filter, pager)
  .execute(client)
  .then(result => {
    res.json({
      videos: result.objects
    })
      console.log(result.objects);
  });
  });

});

app.post('/get-videos', async (req, res) => {

  kaltura.services.session.start(secret, userId, type, partnerId, expiry, privileges)
  .execute(client)
  .then(result => {
    client.setKs(result)

  let filter = new kaltura.objects.MediaEntryFilter();
  filter.createdAtLessThanOrEqual = req.body.created_at;
  filter.orderBy = '-createdAt';
  let pager = new kaltura.objects.FilterPager();

  kaltura.services.media.listAction(filter, pager)
  .execute(client)
  .then(result => {
    res.json({
      videos: result.objects
    });
  });
  });

});

app.post('/upload-video', async (req,res) => {
  console.log(req.body.name);
  console.log(req.body.description);
  console.log(req.body.videoUrl);
  kaltura.services.session.start(secret, userId, type, partnerId, expiry, privileges)
  .execute(client)
  .then(result => {
    client.setKs(result)

    	  let mediaEntry = new kaltura.objects.MediaEntry();
    		mediaEntry.name = req.body.name;
    		mediaEntry.description = req.body.description;
    		mediaEntry.mediaType = kaltura.enums.MediaType.VIDEO;

    		kaltura.services.media.add(mediaEntry)
    		.execute(client)
    		.then(entry => {

    let entryId = entry.id;
    let resource = new kaltura.objects.UrlResource();
    resource.url = req.body.videoUrl;

    kaltura.services.media.addContent(entryId, resource)
    .execute(client)
    .then(result => {
      res.json({
        entry_id: entryId
      });
        console.log(result);
    });
});

  });
});

app.post('/delete-video', async (req, res) => {

  kaltura.services.session.start(secret, userId, type, partnerId, expiry, privileges)
  .execute(client)
  .then(result => {
    client.setKs(result)

  let entryId = req.body.entryId;

kaltura.services.media.deleteAction(entryId)
.execute(client)
.then(result => {
    console.log(result);
    res.json({
      good: "all_good"
    })
});
});
});


const PORT = process.env.PORT || 4243

app.listen(PORT, () => {
  console.log(`Started server on ${ PORT }`);
})
