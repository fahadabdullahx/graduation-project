export async function fetchLocationDetailsById(type, id) {
  try {
    type = type.charAt(0);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/lookup?osm_ids=${type}${id}&format=json&accept-language=ar`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching location details:", error);
    return null;
  }
}
export async function fetchLocationDetails(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&accept-language=1&lang=ar`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching location details:", error);
    return null;
  }
}

export function calculatePrice({
  distance, // in kilometers
  time, // in minutes
  carType, // string identifier
  seat, // number of seats
}) {
  // Base pricing parameters (in SAR)
  const BASE_RATE = 0.5; // per kilometer
  const TIME_RATE = 0.5; // per minute
  const MINIMUM_FARE = 10.0; // minimum fare

  // Car type multipliers
  const CAR_TYPE_MULTIPLIERS = {
    luxury: 2.5,
    standard: 1.5,
    economy: 1.0,
  };

  // Calculate base price
  let basePrice = distance * BASE_RATE + time * TIME_RATE;

  // Apply car type multiplier
  const carMultiplier = CAR_TYPE_MULTIPLIERS[carType] || 1.0;
  basePrice *= carMultiplier;

  // price per seat
  basePrice /= seat;

  // Ensure minimum fare
  const totalPrice = Math.max(basePrice, MINIMUM_FARE);

  // Return price breakdown
  // return Math.round(parseFloat(totalPrice.toFixed(2)));

  return parseFloat(totalPrice.toFixed(2));

  // return {
  //   total: parseFloat(totalPrice.toFixed(2)),
  //   breakdown: {
  //     base: distance * BASE_RATE,
  //     timeCharge: time * TIME_RATE,
  //     carMultiplier,
  //     minimumFareApplied: totalPrice === MINIMUM_FARE,
  //   },
  // };
}

export async function SearchByNameLocation(q) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?addressdetails=1&q=${q}&format=jsonv2&limit=5`
      // &polygon_svg=1000
      // {
      //   headers: {
      //     "Accept-Language": "ar",
      //   },
      // }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching location details:", error);
    return null;
  }
}
