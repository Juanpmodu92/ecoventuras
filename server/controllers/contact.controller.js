import ContactMessage from "../models/contact.model.js";

export const sendMessage = async (req, res) => {
    try {
        const { subject, message } = req.body;
        const newMessage = new ContactMessage({
            user: req.user.id,
            subject,
            message
        });

        const saved = await newMessage.save();
        res.status(201).json({ message: "Mensaje enviado correctamente", data: saved });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllMessages = async (req, res) => {
    try {
        const messages = await ContactMessage.find()
            .populate("user", "firstName lastName email")
            .sort({ createdAt: -1 });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
