/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  let response = await axios.get('http://api.tvmaze.com/search/shows',{params : {q:query}});
  let showsSearch = response.data;
  return showsSearch.reduce(function(accum,show){
    console.log(show.show.image)  
    show = {
        
        id : show.show.id,
        name: show.show.name,
        summary: show.show.summary,
       image: show.show.image ? show.show.image.medium : 'https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300'
      }

      console.log(show.image)
      accum.push(show);
      return accum;
  },[])
  
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
  
  
      let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top"src='${show.image}'>
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button >Episodes
           </div>
         </div>
       </div>
      `);
         

    $showsList.append($item);
    
    
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);
  
  populateShows(shows);

  
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  let response = await axios.get( `http://api.tvmaze.com/shows/${id}/episodes`);
  
 let episodes = response.data.map(episode => ({
    id : episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number

 } ))
 
 return episodes;
  // TODO: return array-of-episode-info, as described in docstring above
}
// I am having troulbe fully understanding how to share returns from functions. for example I had to getEpisodes first using the function above and then I had to use the array that it returned in the next funciton. I always get hung up on this and it creates chaos in my coding would like to go over this thouroguly. 
function populateEpisodes(episodes) {
  let episodesList = $("#episodes-list");
  episodesList.empty();
    
  for (let episode of episodes) {
    let list= $(
      `<li>
         ${episode.name}
         <b>( season ${episode.season}, episode ${episode.number}<b>)
       </li>
      `);

    episodesList.append(list);
  }

  $("#episodes-area").show();
}
$("#shows-list").on("click",'button', async function handleEpisodeClick(evt) {
  let Id = $(evt.target).closest(".Show").data("show-id");
  let episodes = await getEpisodes(Id);
  populateEpisodes(episodes);
});







