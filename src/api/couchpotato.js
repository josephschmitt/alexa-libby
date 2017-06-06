import CouchPotatoAPI from 'couchpotato-api';
import serverConfig from '~/api/config.js';

const couchpotato = new CouchPotatoAPI(serverConfig('movies'));
export default couchpotato;

export async function list() {
  const {movies} = await couchpotato.get('movie.list');

  return movies.map((movie) => {
    const [release] = movie.releases;

    return {
      title: movie.title,
      year: movie.info.year,
      tmdbid: movie.info.tmdb_id,
      status: movie.status,
      quality: release ? release.quality : null
    };
  });
}
