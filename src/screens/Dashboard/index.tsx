import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import { ActivityIndicator } from 'react-native';

import { useTheme } from 'styled-components';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HightlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import { useAuth } from '../../hooks/auth';

import { 
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  LogoutButton,
  Icon,
  HightlightCards,
  Transactions,
  Title,
  TransactionList,
  LoadContainer,
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTransaction: string;
}

interface HighlightData {
  entries: HighlightProps;
  expensives: HighlightProps;
  total: HighlightProps;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

  const theme = useTheme();
  const { signOut, user } = useAuth();

  function getLastTransactionData(
    collection: DataListProps[], 
    type: 'positive' | 'negative'
  ) {
    const collectionFiltered = collection.filter(transaction => transaction.type === type);

    if(collectionFiltered.length === 0) {
      return 0
    }
    const lastTransaction = new Date(
      Math.max.apply(Math, collectionFiltered
      .map(transaction => new Date(transaction.date).getTime()))
    )
    
    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long' })}`;
  }

  async function loadTransactions() {
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensiveTotal = 0;

    const transactionsFormatted: DataListProps[] = transactions
    .map((item: DataListProps) => {

      if(item.type === 'positive') {
        entriesTotal += Number(item.amount);
      } else {
        expensiveTotal += Number(item.amount);
      }

      const amount = Number(item.amount).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });

      const dateFormatted = Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).format(new Date(item.date));

      return {
        id: item.id,
        name: item.name,
        amount,
        type: item.type,
        category: item.category,
        date: dateFormatted
      }
    });

    
    setTransactions(transactionsFormatted)

    const lastTransactionEntries = getLastTransactionData(transactions, 'positive');
    const lastTransactionExpensives = getLastTransactionData(transactions, 'negative');
    const totalInterval = lastTransactionExpensives === 0 ? 'Não há transações' : `01 à ${lastTransactionExpensives}`;

    const total = entriesTotal - expensiveTotal;

    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionEntries === 0
        ? 'Não há transações'
        : `Última entrada dia ${lastTransactionEntries}`
      },
      expensives: {
        amount: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionExpensives === 0
        ? 'Não há transações'
        : `Última saída dia ${lastTransactionExpensives}`
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: totalInterval
      }
    });
    
    setIsLoading(false);
  }

  useEffect(() => {
    loadTransactions();
  }, [])

  useFocusEffect(useCallback(() => {
    loadTransactions();
  }, []));

  return (
    <Container>
      {
        isLoading
        ? <LoadContainer>
            <ActivityIndicator
              size="large"
              color={theme.colors.primary}
            />
          </LoadContainer>
        : <>
            <Header>
              <UserWrapper>
                <UserInfo>
                  <Photo
                    source={{ uri: user.photo }}
                  />
                  <User>
                    <UserGreeting>Olá,</UserGreeting>
                    <UserName>{user.name}</UserName>
                  </User>
                </UserInfo>

                <LogoutButton onPress={signOut}>
                  <Icon name="power" />
                </LogoutButton>
              </UserWrapper>
            </Header>

            <HightlightCards>
              <HightlightCard
                type="up" 
                title="Entradas"
                amount={highlightData?.entries?.amount}
                lastTransaction={highlightData?.entries?.lastTransaction}
              />
              <HightlightCard
                type="down" 
                title="Saídas"
                amount={highlightData?.expensives?.amount}
                lastTransaction={highlightData?.expensives?.lastTransaction}
              />
              <HightlightCard
                type="total" 
                title="Total"
                amount={highlightData?.total?.amount}
                lastTransaction={highlightData?.total?.lastTransaction}
              />
            </HightlightCards>

            <Transactions>
              <Title>
                Listagem
              </Title>
              <TransactionList 
                data={transactions}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <TransactionCard data={item} />}
              />
            </Transactions>
          </>
      }
    </Container>
  )
}