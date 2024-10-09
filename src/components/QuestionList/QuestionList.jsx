import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from '../../app/page.module.css';

const QuestionList = ({ questions, selectedQuestionIndex, onCardClick, onEditClick, onDeleteClick }) => (
  <div className={styles.questionList}>
    <h3>Interview Practice Questions</h3>
    <div>
      {questions.map((question, index) => (
        <Card
          key={index}
          style={{
            marginBottom: "10px",
            cursor: "pointer",
            backgroundColor: selectedQuestionIndex === index ? "#798FF3" : "white",
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center'
          }}
          onClick={() => onCardClick(index)}
        >
          <CardContent>
            <Typography variant="body1">{question}</Typography>
          </CardContent>
          <div style={{display: 'flex', marginRight: '0.5rem', cursor: 'pointer'}}>
              <IconButton onClick={(e) => { e.stopPropagation(); onEditClick(index); }}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={(e) => { e.stopPropagation(); onDeleteClick(index); }}>
                <DeleteIcon />
              </IconButton>
            </div>
        </Card>
      ))}
    </div>
  </div>
);

export default QuestionList;