const cache = new Map();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const buildAreaLabel = (data) => {
  const address = data?.address || {};
  const locality =
    address.city ||
    address.town ||
    address.village ||
    address.hamlet ||
    address.suburb ||
    address.neighbourhood;
  const region = address.county || address.state_district || address.state;
  const country = address.country;

  const parts = [locality, region, country].filter(Boolean);
  if (parts.length > 0) return parts.join(', ');

  if (data?.display_name) {
    return data.display_name.split(',').slice(0, 3).join(',').trim();
  }

  return null;
};

export const formatCoordinates = (lat, lng) => {
  const latNum = Number(lat);
  const lngNum = Number(lng);
  if (Number.isNaN(latNum) || Number.isNaN(lngNum)) return null;
  return `${latNum.toFixed(4)}, ${lngNum.toFixed(4)}`;
};

export async function reverseGeocode(lat, lng) {
  const latNum = Number(lat);
  const lngNum = Number(lng);
  if (Number.isNaN(latNum) || Number.isNaN(lngNum)) return null;

  const cacheKey = `${latNum.toFixed(3)},${lngNum.toFixed(3)}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latNum}&lon=${lngNum}&format=json&zoom=10`;
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'en',
      },
    });

    if (!response.ok) {
      cache.set(cacheKey, null);
      return null;
    }

    const data = await response.json();
    const label = buildAreaLabel(data);
    cache.set(cacheKey, label);
    return label;
  } catch {
    cache.set(cacheKey, null);
    return null;
  }
}

/** Resolve unique coordinate pairs for a list of profiles (Nominatim rate limit: ~1 req/s). */
export async function resolveProfileLocationLabels(profiles = []) {
  const labelsByProfileId = {};
  const coordKeyToArea = {};
  const toResolve = [];

  profiles.forEach((profile) => {
    const coords = formatCoordinates(profile?.lat, profile?.lng);
    const city = profile?.location?.trim();

    labelsByProfileId[profile.id] = {
      area: city || null,
      coordinates: coords,
      resolvedArea: null,
    };

    if (!city && coords) {
      const coordKey = `${Number(profile.lat).toFixed(3)},${Number(profile.lng).toFixed(3)}`;
      if (!coordKeyToArea[coordKey]) {
        coordKeyToArea[coordKey] = { pending: true, profileIds: [] };
        toResolve.push({ coordKey, lat: profile.lat, lng: profile.lng });
      }
      coordKeyToArea[coordKey].profileIds.push(profile.id);
    }
  });

  for (let i = 0; i < toResolve.length; i += 1) {
    const { coordKey, lat, lng } = toResolve[i];
    const area = await reverseGeocode(lat, lng);
    coordKeyToArea[coordKey] = { area, profileIds: coordKeyToArea[coordKey].profileIds };

    coordKeyToArea[coordKey].profileIds.forEach((profileId) => {
      labelsByProfileId[profileId].resolvedArea = area;
      if (!labelsByProfileId[profileId].area && area) {
        labelsByProfileId[profileId].area = area;
      }
    });

    if (i < toResolve.length - 1) {
      await delay(1100);
    }
  }

  return labelsByProfileId;
}

export const getDisplayLocation = (profile, resolvedLabels = {}) => {
  const resolved = resolvedLabels[profile?.id];
  const coords = formatCoordinates(profile?.lat, profile?.lng);

  if (resolved) {
    return {
      area: resolved.area || resolved.resolvedArea || null,
      coordinates: resolved.coordinates || coords,
    };
  }

  return {
    area: profile?.location?.trim() || null,
    coordinates: coords,
  };
};
