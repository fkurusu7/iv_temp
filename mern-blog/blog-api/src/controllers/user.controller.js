export const test = (req, res) => {
  res.status(200).json({ message: "tested from controller" });
};
