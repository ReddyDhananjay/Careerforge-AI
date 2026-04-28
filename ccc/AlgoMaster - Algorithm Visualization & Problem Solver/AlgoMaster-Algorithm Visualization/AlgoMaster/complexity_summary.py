def print_complexity_table():
    print("\n" + "="*75)
    print("                    📊 ALGORITHM COMPLEXITY SUMMARY")
    print("="*75)
    
    algorithms = [
        ("GREEDY", "Activity Selection", "O(n log n)", "O(n log n)", "O(n log n)", "O(n)"),
        ("GREEDY", "Fractional Knapsack", "O(n log n)", "O(n log n)", "O(n log n)", "O(n)"),
        ("GREEDY", "Huffman Coding", "O(n log n)", "O(n log n)", "O(n log n)", "O(n)"),
        ("GREEDY", "Dijkstra's Algorithm", "O(E log V)", "O(E log V)", "O(V²)", "O(V)"),
        ("DP", "Fibonacci (Memo)", "O(n)", "O(n)", "O(n)", "O(n)"),
        ("DP", "0/1 Knapsack", "O(nW)", "O(nW)", "O(nW)", "O(nW)"),
        ("DP", "LCS", "O(mn)", "O(mn)", "O(mn)", "O(mn)"),
        ("DP", "Coin Change", "O(aS)", "O(aS)", "O(aS)", "O(a)"),
        ("SORT", "Merge Sort", "O(n log n)", "O(n log n)", "O(n log n)", "O(n)"),
        ("SORT", "Quick Sort", "O(n log n)", "O(n log n)", "O(n²)", "O(log n)"),
        ("SORT", "Heap Sort", "O(n log n)", "O(n log n)", "O(n log n)", "O(1)"),
        ("GRAPH", "BFS", "O(V+E)", "O(V+E)", "O(V+E)", "O(V)"),
        ("GRAPH", "DFS", "O(V+E)", "O(V+E)", "O(V+E)", "O(V)"),
        ("GRAPH", "Kruskal's MST", "O(E log E)", "O(E log E)", "O(E log E)", "O(V)"),
    ]
    
    print(f"\n{'Type':<10}{'Algorithm':<25}{'Best':<15}{'Average':<15}{'Worst':<15}{'Space'}")
    print("-"*75)
    
    current_category = ""
    for alg in algorithms:
        category, name, best, avg, worst, space = alg
        if category != current_category:
            print()
            current_category = category
        print(f"{category:<10}{name:<25}{best:<15}{avg:<15}{worst:<15}{space}")
    
    print("\n" + "="*75)
    print("  Legend: n=input size, W=capacity, m,n=string lengths,")
    print("          V=vertices, E=edges, a=amount, S=coins count")
    print("="*75)
