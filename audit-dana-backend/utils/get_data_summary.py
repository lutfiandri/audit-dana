import numpy as np


def get_data_summary(data):
    # Step 1: Sort the data
    data.sort()

    # Step 2: Calculate quartiles
    Q1 = np.percentile(data, 25)
    Q2 = np.percentile(data, 50)
    Q3 = np.percentile(data, 75)

    # Step 3: Calculate IQR
    IQR = Q3 - Q1

    # Step 4: Identify outliers
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    outliers = [value for value in data if value <
                lower_bound or value > upper_bound]

    return {
        'Q1': Q1,
        'Q2': Q2,
        'Q3': Q3,
        'IQR': IQR,
        'lower_bound': lower_bound,
        'upper_bound': upper_bound,
        'outliers': outliers
    }
