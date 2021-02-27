const jwt = require("jsonwebtoken");
const User = require("../routes/User/schema");
const fetch = require("node-fetch");

const getCurrentForcast = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minute,hourly&appid=f10ab2fb813b0bacacb830ce8476f281`
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

const getWeather = async (search) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=f10ab2fb813b0bacacb830ce8476f281`
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

const generateJWT = (payload) =>
  new Promise((res, rej) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) rej(err);
        res(token);
      }
    )
  );

const verifyJWT = (token) =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) rej(err);
      res(decoded);
    })
  );

const generateRefreshJWT = (payload) =>
  new Promise((res, rej) =>
    jwt.sign(
      payload,
      process.env.REFRESH_JWT_SECRET,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) rej(err);
        res(token);
      }
    )
  );

const verifyRefreshToken = (token) =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.REFRESH_JWT_SECRET, (err, decoded) => {
      if (err) rej(err);
      res(decoded);
    })
  );

const authenticate = async (user) => {
  try {
    const newAccessToken = await generateJWT({ _id: user._id });
    const newRefreshToken = await generateRefreshJWT({ _id: user._id });

    user.refreshTokens = user.refreshTokens.concat({ token: newRefreshToken });
    console.log("This is the access token-->", newAccessToken);
    await user.save();

    return { token: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

// devo controllare bene quello che succede qua dentro
const refreshToken = async (oldRefreshToken) => {
  const decoded = await verifyRefreshToken(oldRefreshToken);

  const user = await User.findOne({ _id: decoded._id });

  if (!user) {
    throw new Error(`Access is forbidden`);
  }
  const currentRefreshToken = user.refreshTokens.find(
    (t) => t.token === oldRefreshToken
  );

  if (!currentRefreshToken) {
    throw new Error(`Refresh token is wrong`);
  }

  const newAccessToken = await generateJWT({ _id: user._id });
  const newRefreshToken = await generateRefreshJWT({ _id: user._id });

  const newRefreshTokens = user.refreshTokens
    .filter((t) => t.token !== oldRefreshToken)
    .concat({ token: newRefreshToken });

  user.refreshTokens = [...newRefreshTokens];

  await user.save();

  return { token: newAccessToken, refreshToken: newRefreshToken };
};

module.exports = {
  authenticate,
  verifyJWT,
  refreshToken,
  getWeather,
  getCurrentForcast,
};
