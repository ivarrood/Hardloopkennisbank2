
import React, { useState } from 'react';
import Card from '../components/Card';
import { useEditMode } from '../components/EditModeContext';
import { Article, Row, RowLayout } from '../types';
import { generateId } from '../utils/idUtils';

const initialArticlesData: Record<string, Article> = {
  'tg-rol': {
    id: 'tg-rol',
    title: "De rol van een hardlooptrainer",
    content: "Een hardlooptrainer is meer dan alleen iemand die schema's maakt. Goede trainers motiveren, onderwijzen, observeren, en passen trainingen aan op de individuele behoeften en doelen van hun atleten. Ze creëren een positieve en ondersteunende trainingsomgeving.",
    collapsible: true,
    initiallyExpanded: true,
    imageUrl: "https://picsum.photos/seed/coaching/600/300"
  },
  'tg-planning': {
    id: 'tg-planning',
    title: "Trainingsplanning en Periodisering",
    content: "Effectieve coaching begint met een goed doordacht plan. Dit omvat:\n*   **Doelstellingen bepalen:** SMART (Specifiek, Meetbaar, Acceptabel, Realistisch, Tijdgebonden) doelen stellen samen met de atleet.\n*   **Periodisering:** Het seizoen opdelen in cycli (macro, meso, micro) met specifieke focuspunten.\n*   **Balans:** Zorgen voor een goede balans tussen trainingsintensiteit, volume en herstel.\n*   **Flexibiliteit:** Bereid zijn om plannen aan te passen op basis van de voortgang en feedback van de atleet.",
    collapsible: true,
    initiallyExpanded: true,
  },
  'tg-communicatie': {
    id: 'tg-communicatie',
    title: "Communicatie en Feedback",
    content: "Duidelijke en constructieve communicatie is essentieel.\n*   **Actief luisteren:** Begrijpen wat de atleet ervaart en nodig heeft.\n*   **Positieve bekrachtiging:** Successen erkennen en aanmoedigen.\n*   **Constructieve feedback:** Opbouwende kritiek geven gericht op verbetering.\n*   **Duidelijke instructies:** Zorgen dat oefeningen en trainingen goed begrepen worden.",
    collapsible: true,
    initiallyExpanded: true,
  },
  'tg-motivatie': {
    id: 'tg-motivatie',
    title: "Motivatie en Groepsdynamiek",
    content: "Een trainer speelt een grote rol in het motiveren van lopers.\n*   **Intrinsieke motivatie stimuleren:** Helpen lopers plezier en voldoening te vinden in het proces.\n*   **Variatie in training:** Monotonie voorkomen door diverse trainingsvormen aan te bieden.\n*   **Groepscohesie:** Bij groepstrainingen een positieve en ondersteunende sfeer creëren.\n*   **Individuele aandacht:** Ook binnen een groep oog hebben voor de individuele loper.",
    collapsible: true,
    initiallyExpanded: true,
  },
  'tg-blessure': {
    id: 'tg-blessure',
    title: "Blessurepreventie en -management",
    content: "Een belangrijke verantwoordelijkheid van de trainer is het helpen voorkomen van blessures.\n*   **Educatie:** Lopers informeren over risicofactoren en preventieve maatregelen.\n*   **Goede warming-up en cooling-down:** Het belang hiervan benadrukken en demonstreren.\n*   **Techniekcorrectie:** Helpen bij het aanleren van een efficiënte en veilige looptechniek.\n*   **Herkennen van signalen:** Lopers leren luisteren naar hun lichaam en signalen van overbelasting herkennen.\n*   **Doorverwijzen:** Weten wanneer professionele medische hulp ingeschakeld moet worden.",
    collapsible: true,
    initiallyExpanded: true,
  }
};

const initialRowsData: Row[] = [
  { id: generateId(), layout: 'single', articleIds: ['tg-rol'] },
  { id: generateId(), layout: 'double', articleIds: ['tg-planning', 'tg-communicatie'] },
  { id: generateId(), layout: 'single', articleIds: ['tg-motivatie'] },
  { id: generateId(), layout: 'single', articleIds: ['tg-blessure'] },
];


const TrainingGevenPage: React.FC = () => {
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
          return null; 
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
    } else { 
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
            const newPlaceholderArticleId = generateId();
            setArticles(prevArticles => ({
                ...prevArticles,
                [newPlaceholderArticleId]: { id: newPlaceholderArticleId, title: 'Nieuw artikel (rechterkant)', content: 'Voeg hier content toe.', collapsible: true, initiallyExpanded: true, imageUrl: '' }
            }));
            newRows[rowIndex] = { ...currentRow, layout: 'double', articleIds: [...currentRow.articleIds, newPlaceholderArticleId] };
        } else if (currentLayout === 'double' && currentRow.articleIds.includes(articleId)) {
            const otherArticleId = currentRow.articleIds.find(id => id !== articleId);
            newRows[rowIndex] = { ...currentRow, layout: 'single', articleIds: [articleId] };

            if (otherArticleId && articles[otherArticleId]) {
                const newRowForOtherArticle: Row = { id: generateId(), layout: 'single', articleIds: [otherArticleId] };
                newRows.splice(rowIndex + 1, 0, newRowForOtherArticle);
            }
        }
        return newRows.filter(row => row.articleIds.length > 0); 
    });
  };

  return (
    <div className="space-y-8">
      <header className="mb-10">
        <h1 className="text-4xl font-heading font-semibold text-sky-700 text-center">Training geven</h1>
        <p className="text-xl text-slate-600 mt-2 text-center">Principes en praktijken voor effectief hardloopcoaching.</p>
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

export default TrainingGevenPage;