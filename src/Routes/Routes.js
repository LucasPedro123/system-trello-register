const mongoose = require('mongoose'); // Adiciona a importação do Mongoose
const express = require('express');
const router = express.Router();
const Board = require('../Models/kanbanModel');

// Obter todos os quadros (boards)
router.get('/boards', async (req, res) => {
  try {
    const boards = await Board.find();
    res.json(boards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para deletar um board pelo seu ID
router.delete('/boards/:boardId', async (req, res) => {
  try {
    const { boardId } = req.params;

    // Validação do ID para garantir que é um ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({ error: 'Invalid Board ID' });
    }

    const deletedBoard = await Board.findByIdAndDelete(boardId);

    if (!deletedBoard) {
      return res.status(404).json({ error: 'Board não encontrado' });
    }

    res.status(200).json({ message: 'Board deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar board:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rota para deletar um card de um board
router.delete('/boards/:boardId/cards/:cardId', async (req, res) => {
  try {
    const { boardId, cardId } = req.params;

    // Verifica se os IDs são válidos
    if (!mongoose.Types.ObjectId.isValid(boardId) || !mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    // Busca o board pelo ID
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ error: 'Board não encontrado' });
    }

    // Encontra o índice do card a ser removido
    const cardIndex = board.cards.findIndex((card) => card._id.toString() === cardId);
    if (cardIndex === -1) {
      return res.status(404).json({ error: 'Card não encontrado' });
    }

    // Remove o card do array de cards do board
    board.cards.splice(cardIndex, 1);

    // Salva o board atualizado
    await board.save();

    res.status(200).json({ message: 'Card removido com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar card:', error);
    res.status(500).json({ error: 'Erro ao deletar card' });
  }
});

// Rota para criar um novo board
router.post('/boards', async (req, res) => {
  try {
    const { title } = req.body; // Assegura que o título está presente
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'O título é obrigatório e deve ser uma string' });
    }

    const newBoard = new Board({ title }); // Cria um novo board com título
    const savedBoard = await newBoard.save();

    res.status(201).json(savedBoard);
  } catch (error) {
    console.error('Erro ao criar board:', error); // Log de depuração
    res.status(400).json({ error: error.message });
  }
});
router.put('/boards/:boardId/cards/:cardId', async (req, res) => {
  try {
    const { boardId, cardId } = req.params;

    // Certifique-se de que os IDs são válidos ObjectId
    if (!mongoose.Types.ObjectId.isValid(boardId) || !mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ error: 'Board não encontrado' });
    }

    const cardIndex = board.cards.findIndex(card => card._id.toString() === cardId);

    if (cardIndex === -1) {
      return res.status(404).json({ error: 'Card não encontrado' });
    }

    board.cards[cardIndex] = { ...board.cards[cardIndex], ...req.body };
    await board.save();

    res.status(200).json(board.cards[cardIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/boards/:boardId/cards', async (req, res) => {
  try {
    const { boardId } = req.params;
    const newCardData = req.body;

    console.log("-> ", boardId, " ", newCardData)
    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({ error: 'Invalid Board ID' });
    }

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    board.cards.push(newCardData);
    await board.save(); // Salva a atualização no banco de dados

    res.status(201).json({ message: 'Card criado com sucesso', card: newCardData });
  } catch (error) {
    console.error('Erro ao criar card:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
