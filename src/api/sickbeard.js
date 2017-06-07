import SickBeardAPI from 'node-sickbeard';
import serverConfig from '~/api/config.js';

const sickbeard = new SickBeardAPI(serverConfig('shows'));
export default sickbeard;

export async function list() {
  const resp = await sickbeard.cmd('shows', {sort: 'name'});

  return Object.keys(resp.data).map((key) => {
    const show = resp.data[key];

    return {
      title: show.show_name,
      year: show.year,
      tvdbid: show.tvdbid,
      status: show.status.toLowerCase(),
      quality: show.quality
    };
  });
}

export async function search(name) {
  const resp = await sickbeard.cmd('sb.searchtvdb', {name});
  const results = Array.isArray(resp.data.results) ? resp.data.results : [];

  return results.map((show) => {
    return {
      title: show.name,
      year: new Date(show.first_aired).getFullYear(),
      tvdbid: show.tvdbid
    };
  });
}

export async function add(show) {
  const resp = await sickbeard.cmd('show.addnew', {tvdbid: show.tvdbid, status: 'wanted'});
  return resp;
}
