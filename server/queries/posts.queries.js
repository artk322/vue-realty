const { pool } = require('./db.config');

const fetchPosts = (req, res) => {
  pool.query(`SELECT * FROM posts ORDER BY creation_date DESC`, (error, posts) => {
    if (error) {
      return res.status(404).send({ message: error.message });
    }
    return res.status(200).send({ posts: posts.rows });
  });
};

const fetchGeometry = (req, res) => {
  const { pid } = req.body;
  pool.query(
    'SELECT ST_AsGeoJSON(geom) AS geometry, zoom, center, gid FROM geometries WHERE pid = $1',
    [pid],
    (error, geometries) => {
      if (error) {
        return res.status(404).send({ message: error.message });
      }
      if (geometries.rows.length) {
        const features = [];
        geometries.rows.map((it, idx) => {
          features.push({
            id: idx,
            type: 'Feature',
            properties: {},
            geometry: JSON.parse(it.geometry),
          });
        });

        const featureCollection = {
          type: 'FeatureCollection',
          features,
        };
        const payload = {
          gid: geometries.rows[0].gid,
          featureCollection,
          zoom: geometries.rows[0].zoom,
          center: JSON.parse(geometries.rows[0].center),
        };
        return res.status(200).send(payload);
      }
    }
  );
};

const createPost = async (req, res) => {
  const owner_uid = req.user.uid;
  const {
    title,
    price,
    location,
    space,
    images,
    categories,
    description,
    geometry,
    zoom,
    center,
  } = req.body;

  const errors = [];

  await pool.query(
    'INSERT INTO posts(title, price, location, space, images, categories, description, owner_uid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING pid',
    [title, price, location, space, images, categories, description, owner_uid],
    (error, post) => {
      if (error) errors.push({ message: error.message });
      const pid = post.rows[0].pid;
      const mapCenter = JSON.stringify(center);
      if (geometry) {
        geometry.features.map(async it => {
          const geoJSON = JSON.stringify(it.geometry);
          console.log('CREATE:', { pid, geoJSON, mapCenter, zoom });
          await pool.query(
            'INSERT INTO geometries(pid, geom, zoom, center) VALUES ($1, ST_GeomFromGeoJSON($2), $3, $4)',
            [pid, geoJSON, zoom, mapCenter],
            errorGeom => {
              if (errorGeom) errors.push({ message: errorGeom.message });
            }
          );
        });
        if (errors.length) {
          return res.status(406).send(errors[0]);
        } else {
          return res.status(201).send({ message: 'Пост успешно создан' });
        }
      }
    }
  );
};

const updatePost = (req, res) => {
  const user = req.user;
  const {
    pid,
    title,
    price,
    location,
    space,
    images,
    categories,
    description,
    geometry,
    zoom,
    center,
  } = req.body;

  const errors = [];

  pool.query('SELECT * FROM posts WHERE pid = $1', [pid], (error, posts) => {
    if (error) errors.push({ message: error.message });
    if (posts.rows.length == 0) {
      return res.status(404).send({ message: 'Участок не найден' });
    }

    const post = posts.rows[0];
    if (user.uid == post.owner_uid || user.is_admin == true) {
      pool.query(
        'UPDATE posts SET title = $1, price = $2, location = $3, space = $4, images = $5, categories = $6, description = $7 WHERE pid = $8',
        [title, price, location, space, images, categories, description, pid],
        error => {
          if (error) errors.push({ message: error.message });
          const mapCenter = JSON.stringify(center);
          if (geometry) {
            pool.query('DELETE FROM geometries WHERE pid = $1', [pid], error2 => {
              if (error) errors.push({ message: error2.message });
            });
            geometry.features.map(async it => {
              const geoJSON = JSON.stringify(it.geometry);
              console.log('UPDATE:', { pid, geoJSON, mapCenter, zoom });
              await pool.query(
                'INSERT INTO geometries(pid, geom, zoom, center) VALUES ($1, ST_GeomFromGeoJSON($2), $3, $4)',
                [pid, geoJSON, zoom, mapCenter],
                errorGeom => {
                  if (errorGeom) {
                    errors.push({ message: errorGeom.message });
                  }
                }
              );
            });
          }
          if (errors.length) {
            return res.status(406).send(errors[0]);
          } else {
            return res.status(201).send({ message: 'Участок успешно обновлен!' });
          }
        }
      );
    } else {
      return res.status(403).send({ message: 'Недостаточно прав' });
    }
  });
};

const deletePost = (req, res) => {
  const user = req.user;
  const { pid } = req.body;

  pool.query('SELECT * FROM posts WHERE pid = $1', [pid], (error, posts) => {
    if (error) return res.status(406).send({ message: error.message });
    if (posts.rows.length == 0) {
      return res.status(404).send({ message: 'Участок не найден' });
    }

    const post = posts.rows[0];
    if (user.uid == post.owner_uid || user.is_admin == true) {
      pool.query('DELETE FROM posts WHERE pid = $1', [pid], error => {
        if (error) return res.status(404).send({ message: error.message });
        return res.status(202).send({ message: 'Участок успешно удален!' });
      });
    }
  });
};

module.exports = {
  fetchPosts,
  fetchGeometry,
  createPost,
  updatePost,
  deletePost,
};

/*
  {"id":"95e5d82350d5f89ae590dfe986f90dbe","type":"Feature","properties":{},"geometry":{"coordinates":[[[-110.41406250000034,43.69731785154087],[-105.66796875000014,36.303671265738316],[-86.68359375000004,40.30220405615526],[-90.72656249999983,45.941266392209826],[-110.41406250000034,43.69731785154087]]],"type":"Polygon"}}
*/
