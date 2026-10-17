import { typography } from "./typography-tree";
import { typograph } from "./typography";
import type { ReactNode } from "react";
function ExperienceCard({
  iconSrc,
  title,
  dates,
  children,
}: {
  iconSrc: string;
  title: string;
  dates: string;
  children: ReactNode;
}) {
  return (
    <article className="experience-card">
      <div className="experience-card__mark" aria-hidden="true">
        <img alt="" src={iconSrc} />
      </div>
      <div>
        <h3>{typograph(title)}</h3>
        <p className="experience-card__dates"><strong>{typograph(dates)}</strong></p>
        {typography(children)}
      </div>
    </article>
  );
}


export function Experience() { return (<div className="experience-list">
              <ExperienceCard
                iconSrc="/media/employer-mindbox.svg"
                title="Mindbox · Product Owner / Product Manager → Product Designer"
                dates="Сентябрь 2019 – декабрь 2025 · 6 лет 4 месяца"
              >
                <p>
                  Mindbox – платформа автоматизации маркетинга, которая объединяет
                  клиентские данные из онлайна и офлайна и помогает компаниям
                  запускать персонализированные коммуникации в разных каналах.
                </p>
                <p>
                  Три года работал Product Designer:
                  проектировал сложные B2B-интерфейсы, проводил исследования,
                  развивал email-конструктор и дизайн-систему, сопровождал решения
                  от постановки задачи до запуска.
                </p>
                <p>
                  До этого три с половиной года работал Product Manager: формировал
                  продуктовую стратегию, исследовал клиентские задачи, управлял
                  бэклогом и командой, проверял гипотезы и отвечал за развитие
                  продукта.
                </p>
              </ExperienceCard>

              <ExperienceCard
                iconSrc="/media/icon-programmnye-tehnologii.png"
                title="Программные технологии · Бизнес-аналитик с функциями менеджера продукта"
                dates="Ноябрь 2017 – август 2019 · 1 год 10 месяцев"
              >
                <p>
                  Программные технологии – компания, занимающаяся внедрением
                  проектов по автоматизации бизнес-процессов и разработкой
                  продуктов на платформе Creatio. Я работал в продуктовой команде
                  и создавал продукты по автоматизации программы лояльности и
                  документооборота, развивал коннектор к системам 1С и сервис SMS-рассылок.
                </p>
                <p>
                  Совмещал продуктовую аналитику и функции владельца продукта:
                  формулировал клиентские задачи, вёл бэклог, проверял гипотезы,
                  проектировал интерфейсы и сопровождал разработку B2B-продуктов.
                </p>
              </ExperienceCard>

              <ExperienceCard
                iconSrc="/media/employer-infopro.svg"
                title="ИнфоПро · Специалист по внедрению информационных систем"
                dates="Ноябрь 2016 – ноябрь 2017 · 1 год"
              >
                <p>
                  ИнфоПро – системный интегратор, экспертно-консалтинговая компания
                  в сфере цифровизации бизнес-процессов предприятий энергетики.
                  Там я работал над системой онлайн-контроля
                  технических показателей электростанции, расчёта оптимальных
                  режимов работы ТЭЦ и оперативного управления её работой.
                </p>
                <p>
                  Собирал и анализировал требования, ставил задачи разработчикам,
                  внедрял и сопровождал информационные системы на
                  теплоэнергетических станциях.
                </p>
              </ExperienceCard>
            </div>); }
