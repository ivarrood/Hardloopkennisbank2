
import React, { useState } from 'react';
import Card from '../components/Card';
import { useEditMode } from '../components/EditModeContext';
import { Article, Row, RowLayout } from '../types';
import { generateId } from '../utils/idUtils';

const initialArticlesData: Record<string, Article> = {
  'tm-duurtraining': {
    id: 'tm-duurtraining',
    title: "Duurtraining (Endurance Training)",
    content: "Duurtraining vormt de basis voor de meeste hardloopprestaties. Het verbetert het cardiovasculaire systeem, de vetverbranding en het spieruithoudingsvermogen.\n*   **Lange, langzame duurlopen (LSD):** Lopen op een comfortabel, conversatie tempo voor langere tijd.\n*   **Tempoduurlopen:** Lopen op een \"comfortabel zwaar\" tempo, net onder de anaerobe drempel.\n*   **Herstelduurlopen:** Korte, langzame loopjes om actief herstel te bevorderen.",
    collapsible: true,
    initiallyExpanded: true,
    imageUrl: "https://picsum.photos/seed/endurance/600/300"
  },
  'tm-interval': {
    id: 'tm-interval',
    title: "Intervaltraining",
    content: "Intervaltraining wisselt periodes van hoge intensiteit af met periodes van lage intensiteit (herstel). Het is zeer effectief voor het verbeteren van de VO2max, snelheid en loop-efficiëntie.\n*   **Korte intervallen:** Bijv. 200m-400m sprints met actief herstel.\n*   **Lange intervallen:** Bijv. 800m-1600m herhalingen op een pittig tempo.\n*   **Fartlek (snelheidsspel):** Ongeplande versnellingen tijdens een duurloop.",
    collapsible: true,
    initiallyExpanded: true,
    imageUrl: "https://picsum.photos/seed/interval/600/300"
  },
  'tm-kracht': {
    id: 'tm-kracht',
    title: "Krachttraining voor Hardlopers",
    content: "Krachttraining helpt bij het verbeteren van de loop-efficiëntie, het voorkomen van blessures en het verhogen van de algehele belastbaarheid. Focus op functionele kracht en core stability.\n*   **Core-oefeningen:** Planken, crunches, leg raises.\n*   **Oefeningen voor de benen:** Squats, lunges, deadlifts, calf raises.\n*   **Plyometrie:** Explosieve oefeningen zoals box jumps (voor gevorderden).",
    collapsible: true,
    initiallyExpanded: true,
  },
  'tm-andere': {
    id: 'tm-andere',
    title: "Andere Trainingsvormen",
    content: "*   **Heuveltraining:** Verbetert kracht, snelheid en looptechniek. Kan zowel als sprint of duurtraining.\n*   **Cross-training:** Activiteiten zoals fietsen, zwemmen of roeien om de conditie te onderhouden met minder impact op de gewrichten.\n*   **Techniektraining:** Specifieke oefeningen (loopscholing) gericht op het verbeteren van de loopvorm.",
    collapsible: true,
    initiallyExpanded: true,
  }
};

const initialRowsData: Row[] = [
  { id: generateId(), layout: 'single', articleIds: ['tm-duurtraining'] },
  { id: generateId(), layout: 'double', articleIds: ['tm-interval', 'tm-kracht'] },
  { id: generateId(), layout: 'single', articleIds: ['tm-andere'] },
];

const TrainingsmethodePage: React.FC = () => {
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
        <h1 className="text-4xl font-heading font-semibold text-sky-700 text-center">Trainingsmethoden</h1>
        <p className="text-xl text-slate-600 mt-2 text-center">Verschillende manieren om je loopdoelen te bereiken.</p>
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

export default TrainingsmethodePage;