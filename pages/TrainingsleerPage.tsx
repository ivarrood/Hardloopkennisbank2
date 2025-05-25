
import React, { useState } from 'react';
import Card from '../components/Card';
import { useEditMode } from '../components/EditModeContext';
import { Article, Row, RowLayout } from '../types';
import { generateId } from '../utils/idUtils';

// Initial data based on the original TrainingsleerPage content
const initialArticlesData: Record<string, Article> = {
  'article1_tl': {
    id: 'article1_tl',
    title: 'Wat is Trainingsleer?',
    content: 'Trainingsleer is de studie van de principes en processen die ten grondslag liggen aan fysieke training en prestatieverbetering. Het omvat kennis over hoe het lichaam reageert en zich aanpast aan trainingsprikkels, en hoe deze kennis kan worden toegepast om trainingsprogramma\'s te optimaliseren.',
    imageUrl: 'https://picsum.photos/seed/theory/600/300',
    collapsible: true,
    initiallyExpanded: true,
  },
  'article2_tl': {
    id: 'article2_tl',
    title: 'Kernprincipes van Training',
    content: '*   **Overload (Overbelasting):** Om verbetering te stimuleren, moet het lichaam worden blootgesteld aan een trainingsprikkel die zwaarder is dan het gewend is.\n*   **Specificiteit:** Trainingseffecten zijn specifiek voor het type training dat wordt uitgevoerd. Train zoals je wilt presteren.\n*   **Reversibiliteit:** "Use it or lose it." Trainingsvoordelen gaan verloren als de training wordt gestopt of significant verminderd.\n*   **Individualiteit:** Iedereen reageert anders op training vanwege genetische factoren, trainingsgeschiedenis en andere individuele verschillen.\n*   **Progressie:** De trainingsbelasting moet geleidelijk worden verhoogd naarmate het lichaam zich aanpast om continue verbetering te waarborgen.',
    imageUrl: '',
    collapsible: true,
    initiallyExpanded: true,
  },
  'article3_tl': {
    id: 'article3_tl',
    title: 'Adaptatie en Supercompensatie',
    content: '**Adaptatie** verwijst naar de fysiologische aanpassingen die in het lichaam optreden als reactie op training. Deze aanpassingen maken het lichaam beter bestand tegen toekomstige stress.\n\n**Supercompensatie** is het fenomeen waarbij het lichaam, na een periode van training en herstel, zich herstelt tot boven het oorspronkelijke prestatieniveau. Dit is de basis van prestatieverbetering. Een juiste balans tussen training en herstel is cruciaal voor supercompensatie.',
    imageUrl: 'https://picsum.photos/seed/supercompensation/600/300',
    collapsible: true,
    initiallyExpanded: true,
  },
  'article4_tl': {
    id: 'article4_tl',
    title: 'Periodisering',
    content: 'Periodisering is het systematisch plannen van training in cycli (macro-, meso-, en microcycli) om piekprestaties op het juiste moment te bereiken en overtraining te voorkomen. Het omvat variaties in trainingsvolume, -intensiteit en -type gedurende het seizoen.',
    imageUrl: '',
    collapsible: true,
    initiallyExpanded: true,
  },
};

const initialRowsData: Row[] = [
  { id: generateId(), layout: 'single', articleIds: ['article1_tl'] },
  { id: generateId(), layout: 'double', articleIds: ['article2_tl', 'article3_tl'] },
  { id: generateId(), layout: 'single', articleIds: ['article4_tl'] },
];


const TrainingsleerPage: React.FC = () => {
  const { isEditing } = useEditMode();
  const [articles, setArticles] = useState<Record<string, Article>>(initialArticlesData);
  const [rows, setRows] = useState<Row[]>(initialRowsData);

  const handleUpdateArticle = (articleId: string, updates: Partial<Article>) => {
    setArticles(prev => ({ ...prev, [articleId]: { ...prev[articleId], ...updates } }));
  };

  const handleDeleteArticle = (articleIdToDelete: string, rowId: string, currentLayout: RowLayout) => {
    setArticles(prevArticles => {
      const newArticles = { ...prevArticles };
      delete newArticles[articleIdToDelete];
      return newArticles;
    });

    setRows(prevRows => prevRows.map(row => {
      if (row.id === rowId) {
        const updatedArticleIds = row.articleIds.filter(id => id !== articleIdToDelete);
        if (updatedArticleIds.length === 0) {
          return null; // Mark row for deletion
        }
        return { ...row, articleIds: updatedArticleIds, layout: updatedArticleIds.length === 1 ? 'single' : row.layout };
      }
      return row;
    }).filter(row => row !== null) as Row[]);
  };

  const handleAddRow = (layout: RowLayout) => {
    const newRowId = generateId();
    let newArticleIds: string[] = [];
    const newArticlesToAdd: Record<string, Article> = {};

    if (layout === 'single') {
      const newArticleId = generateId();
      newArticleIds = [newArticleId];
      newArticlesToAdd[newArticleId] = { id: newArticleId, title: 'Nieuw artikel', content: 'Begin hier met schrijven...', collapsible: true, initiallyExpanded: true, imageUrl: '' };
    } else { // double
      const newArticleId1 = generateId();
      const newArticleId2 = generateId();
      newArticleIds = [newArticleId1, newArticleId2];
      newArticlesToAdd[newArticleId1] = { id: newArticleId1, title: 'Nieuw artikel 1', content: 'Inhoud voor artikel 1...', collapsible: true, initiallyExpanded: true, imageUrl: '' };
      newArticlesToAdd[newArticleId2] = { id: newArticleId2, title: 'Nieuw artikel 2', content: 'Inhoud voor artikel 2...', collapsible: true, initiallyExpanded: true, imageUrl: '' };
    }
    
    setArticles(prev => ({ ...prev, ...newArticlesToAdd }));
    setRows(prev => [...prev, { id: newRowId, layout, articleIds: newArticleIds }]);
  };

  const handleMoveRow = (rowId: string, direction: 'up' | 'down') => {
    setRows(prevRows => {
      const index = prevRows.findIndex(row => row.id === rowId);
      if (index === -1) return prevRows;

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prevRows.length) return prevRows;

      const newRows = [...prevRows];
      const temp = newRows[index];
      newRows[index] = newRows[newIndex];
      newRows[newIndex] = temp;
      return newRows;
    });
  };
  
  const handleChangeArticleLayout = (articleId: string, rowId: string, currentLayout: RowLayout) => {
    setRows(prevRows => {
        const newRows = [...prevRows];
        const rowIndex = newRows.findIndex(r => r.id === rowId);
        if (rowIndex === -1) return prevRows;

        const currentRow = newRows[rowIndex];

        if (currentLayout === 'single' && currentRow.articleIds.includes(articleId)) {
            // Change from single to double: add a placeholder for the second article
            const newPlaceholderArticleId = generateId();
            setArticles(prevArticles => ({
                ...prevArticles,
                [newPlaceholderArticleId]: { id: newPlaceholderArticleId, title: 'Nieuw artikel (rechterkant)', content: 'Voeg hier content toe.', collapsible: true, initiallyExpanded: true, imageUrl: '' }
            }));
            newRows[rowIndex] = { ...currentRow, layout: 'double', articleIds: [...currentRow.articleIds, newPlaceholderArticleId] };
        } else if (currentLayout === 'double' && currentRow.articleIds.includes(articleId)) {
            // Change from double to single:
            // If this article is kept, the other is moved to a new single row
            // If this article is the one being "promoted" to single.
            const otherArticleId = currentRow.articleIds.find(id => id !== articleId);
            newRows[rowIndex] = { ...currentRow, layout: 'single', articleIds: [articleId] };

            if (otherArticleId && articles[otherArticleId]) {
                // Create a new row for the other article
                const newRowForOtherArticle: Row = { id: generateId(), layout: 'single', articleIds: [otherArticleId] };
                newRows.splice(rowIndex + 1, 0, newRowForOtherArticle);
            }
        }
        return newRows.filter(row => row.articleIds.length > 0); // Clean up empty rows if any
    });
};


  return (
    <div className="space-y-8">
      <header className="mb-10">
        <h1 className="text-4xl font-heading font-semibold text-sky-700 text-center">Trainingsleer</h1>
        <p className="text-xl text-slate-600 mt-2 text-center">De wetenschappelijke basis van effectief trainen.</p>
      </header>

      {isEditing && (
        <div className="mb-6 p-4 bg-sky-100 rounded-lg shadow flex gap-4 justify-center">
          <button
            onClick={() => handleAddRow('single')}
            className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded"
          >
            Nieuwe sectie (volledig)
          </button>
          <button
            onClick={() => handleAddRow('double')}
            className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
          >
            Nieuwe sectie (2 kolommen)
          </button>
        </div>
      )}

      {rows.map((row, rowIndex) => (
        <div key={row.id} className={row.layout === 'double' ? 'grid md:grid-cols-2 gap-8' : 'space-y-8'}>
          {row.articleIds.map(articleId => {
            const article = articles[articleId];
            if (!article) return null;
            return (
              <Card
                key={article.id}
                article={article}
                isEditing={isEditing}
                onUpdateArticle={handleUpdateArticle}
                onDeleteArticle={handleDeleteArticle}
                onChangeArticleLayout={handleChangeArticleLayout}
                onMoveRowUp={rowIndex > 0 ? () => handleMoveRow(row.id, 'up') : undefined}
                onMoveRowDown={rowIndex < rows.length - 1 ? () => handleMoveRow(row.id, 'down') : undefined}
                rowId={row.id}
                currentLayout={row.layout}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default TrainingsleerPage;