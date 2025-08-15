
import User from "../models/user.model.js";

export const getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        console.log("Favoritos sin populate:", user.favorites);

        const populatedUser = await User.findById(req.user.id).populate("favorites", "name price description image");
        console.log("Favoritos populados:", populatedUser.favorites);

        res.json(populatedUser.favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addFavorite = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        console.log("Usuario desde favoritos:", user);

        const productId = req.params.id;

        if (user.favorites.includes(productId)) {
            return res.status(400).json({ message: "Ya está en favoritos" });
        }

        user.favorites.push(productId);
        await user.save();

        res.status(200).json({ message: "Agregado a favoritos" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeFavorite = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const productId = req.params.id;

        user.favorites = user.favorites.filter(
            (favId) => favId.toString() !== productId
        );
        await user.save();

        res.status(200).json({ message: "Eliminado de favoritos" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
