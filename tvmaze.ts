import axios from "axios"
import * as $ from 'jquery';

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const DEFAULT_SHOW_IMG: string = "https://tinyurl.com/tv-missing"

/**interface for single show data */
interface ShowInterface {
  id: number;
  name: string;
  summary: string;
  image: { original?: string };
}
interface EpisodeInterface {
  id: number,
  name: string,
  season: number,
  number: number
}

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term: string): Promise<ShowInterface[]> {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const apiUrl: string = `https://api.tvmaze.com/search/shows?q=${term}`;
  const result = await axios.get(apiUrl);
  const showData = result.data.map((res: { show: ShowInterface }) => {
    const show = res.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image.original || DEFAULT_SHOW_IMG,
    }
  });

  return showData
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows: ShowInterface[]) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="http://static.tvmaze.com/uploads/images/medium_portrait/160/401704.jpg"
              alt="Bletchly Circle San Francisco"
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val() as string;
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */



async function getEpisodesOfShow(id: number): Promise<EpisodeInterface[]> {
  const apiUrl = `https://api.tvmaze.com/shows/${id}/episodes`;
  const res = await axios.get(apiUrl);
  const data = await res.data;
  const result = data.map((d:EpisodeInterface) => { 
    return{
      id:d.id, 
      name:d.name, 
      season:d.season, 
      number:d.number} 
    });
    return result;
} //Question: Why do we have two return statements?


/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }